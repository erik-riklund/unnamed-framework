import type {
  Dependencies,
  Element,
  Options,
  RenderFunction,
  Template
} from './types';

/**
 * ?
 * 
 * @param variable - The variable to be transformed.
 * @returns The transformed variable path.
 */
const createContextVariablePath = (
  variable: string): string => `self.${ variable.replaceAll('.', '?.') }`;

/**
 * ?
 * 
 * @param variable - The variable path to be transformed.
 * @returns The transformed variable path.
 */
const createLocalVariablePath = (variable: string): string =>
{
  const dotIndex = variable.indexOf('.');
  const baseVariableName = dotIndex !== -1 ? variable.slice(0, dotIndex) : variable;

  return `(typeof ${ baseVariableName }!=='undefined'?${ variable.replaceAll('.', '?.') }:null)`;
};

/**
 * Defines all recognized template syntax elements and their transformation rules.
 * Each entry includes a regular expression to match and a corresponding replacement.
 * These rules are applied to the template to transform custom syntax into valid JS code.
 */
const elements: Record<string, Element> =
{
  /**
   * Handles block content insertion (`{{@ children }}`)
   */
  children:
  {
    pattern: /\{\{\s*@\s*children\s*\}\}/gs,
    replacement: `\${v(self.__children_r)||''}`
  },

  /**
   * Handles variable interpolation and fallback values.
   * 
   * Supported modifiers:
   * - `!` - raw output, no HTML encoding
   * - `&` - pass by reference, no stringify
   * - `:` - local scope variable access
   */
  variable:
  {
    pattern: /(?<!\w+=)\{\{([^}]+)\}\}/gs,

    replacement: (_, ...[declarations]) =>
    {
      const values: string[] = [];
      const variables = declarations.trim().matchAll(
        /(?<=^|(?:->\s*))((?:!)?:?)?\s*((?:\w+(?:\.\w+)*)|(?:"[^"]+"))(?=(?:\s*->)|$|\s*\})/g
      );

      for (const [_, modifiers, variable] of variables)
      {
        if (variable.startsWith('"') && variable.endsWith('"'))
        {
          values.push(`\`${ variable.slice(1, -1).replaceAll("`", "\\`") }\``);

          continue; // string literal
        }

        const useEncoder = modifiers === undefined ||
          (!modifiers?.startsWith('!') && !modifiers?.startsWith('&'));
        const useStringify = modifiers === undefined || !modifiers?.includes('&');
        const useLocalScope = modifiers !== undefined && modifiers.endsWith(':');

        const value = useLocalScope
          ? createLocalVariablePath(variable)
          : createContextVariablePath(variable);

        values.push(
          useStringify ? `${ useEncoder ? 'e(' : '' }s(v(${ value }))${ useEncoder ? ')' : '' }` : `v(${ value })`
        );
      }

      return `\${${ values.join('||') }||''}`;
    }
  },

  /**
   * Handles conditional rendering (`<if>`, `<else-if>`, `<else>`, `</if>`)
   */
  condition:
  {
    pattern: /<(else-)?if\s+(?:(not)\s+)?condition=\{\{\s*(:)?\s*(\w+)\s*\}\}>/gs,

    replacement: (_, ...[prefix, not, scope, condition]) =>
    {
      const negationOperator = (not === 'not') ? '!' : '';
      const conditionalPrefix = (prefix === 'else-') ? '\`}else ' : '${(()=>{';

      const variablePath = (scope === ':')
        ? createLocalVariablePath(condition)
        : createContextVariablePath(condition);

      return `${ conditionalPrefix }if(${ negationOperator }r(${ variablePath })){return\``;
    }
  },

  elseBlock: { pattern: /<else>/gs, replacement: `\`}else{return\`` },
  endCondition: { pattern: /<\/if>/gs, replacement: `\`}})()||''}` },

  /**
   * Allows for rendering of components with attributes and children.
   */
  component:
  {
    pattern: /<component\s+(\w+)(?:\s+([^>]+))?>/gs,

    replacement: (_, ...[name, attributes]) =>
    {
      const context: string[] = [];
      const properties = attributes?.matchAll(
        /(?<=^|\s)(~?&?:?)?\s*(\w+(?:\.\w+)*)(?:=((?:\{\{\s*&?:?\s*\w+(?:\.\w+)*\s*\}\})|(?:"(?:.*?)(?<!\\)")))?/gs
      );

      if (properties)
      {
        for (const [, modifiers, attribute, value] of properties)
        {
          if (modifiers?.startsWith('~'))
          {
            const key = attribute.includes('.')
              ? attribute.slice(attribute.lastIndexOf('.') + 1) : attribute;

            const safeVariablePath = modifiers.endsWith(':')
              ? createLocalVariablePath(attribute)
              : createContextVariablePath(attribute);

            context.push(`${ key }:v(${ safeVariablePath })`);

            continue;
          }

          if (value?.startsWith('"') && value?.endsWith('"'))
          {
            context.push(`${ attribute }:\`${ value.slice(1, -1).replaceAll("`", "\\`") }\``);

            continue;
          }

          if (value?.startsWith('{{') && value?.endsWith('}}'))
          {
            let useStringify = true;
            let useLocalScope = false;
            let variablePath = value.slice(2, -2).trim();

            if (variablePath.startsWith('&'))
            {
              useStringify = false;
              variablePath = variablePath.slice(1);
            }

            if (variablePath.startsWith(':'))
            {
              useLocalScope = true;
              variablePath = variablePath.slice(1);
            }

            const safeVariablePath = useLocalScope
              ? createLocalVariablePath(variablePath)
              : createContextVariablePath(variablePath);

            context.push(`${ attribute }:${ useStringify ? `s(v(${ safeVariablePath }))` : `v(${ safeVariablePath })` }`);

            continue;
          }

          throw new Error(`Invalid attribute value for "${ attribute }": ${ value }`);
        }
      }

      context.push(`__children:()=>\``);
      const isSelfClosing = attributes?.endsWith('/');

      return `\${__${ name }({${ context.join(',') }${ isSelfClosing ? '`},self)}' : '' }`;
    }
  },

  componentEnd: { pattern: /<\/component>/gs, replacement: '`},self)}' },

  /**
   * List rendering block (`<list>` and `<reverse-list>`).
   * This allows for iterating over arrays and rendering their items.
   */
  list:
  {
    pattern: /<(reverse-)?list\s+(:)?(\w+(?:\.\w+)*)\s+as="\s*(\w+(?:\s*,\s*\w+)*)\s*">/gs,

    replacement: (_, ...[prefix, scope, source, variable]) =>
    {
      const safeSourcePath = scope === ':'
        ? createLocalVariablePath(source)
        : createContextVariablePath(source);

      const useDestructuring = variable.includes(',');
      const reverseFunctionCall = prefix === 'reverse-' ? '.reverse()' : '';
      const variableList = useDestructuring ? `{${ variable }}` : variable;

      return `\${(()=>{let o='';const l=v(${ safeSourcePath })||[];` +
        `for(const ${ variableList } of l${ reverseFunctionCall }){o+=\``;
    }
  },

  listEnd: { pattern: /<\/(?:reverse-)?list>/gs, replacement: `\`}return o})()}` },
  listFallback: { pattern: /<empty>/g, replacement: `\`}if(!o.length){o=\`` },
  listFallbackEnd: { pattern: /<\/empty>/gs, replacement: '' },

  /**
   * Named slot definition (`<slot name>`).
   * This allows for defining reusable content areas within components.
   */
  slot: {
    pattern: /<slot\s+(\w+)(\s*\/)?>/gs,
    replacement: (_, ...[name, suffix]) =>
    {
      const closed = suffix?.endsWith('/');

      return `\${v(parent.__slot_${ name })||\`${ closed ? '`}' : '' }`;
    }
  },

  slotEnd: { pattern: /<\/slot>/gs, replacement: '`}' },

  /**
   * Injection of content into named slots (`<render slot>`).
   * This allows for dynamic content rendering within specific slots.
   */
  render: { pattern: /<render\s+slot="\s*(\w+)\s*">/gs, replacement: `\${(()=>{self.__slot_$1=()=>\`` },
  renderEnd: { pattern: /<\/render>/gs, replacement: `\`})()||''}` },

  /**
   * Conditional rendering block (`<when>`).
   * This allows for conditional rendering based on variable values.
   */
  when:
  {
    pattern: /<when\s+value\-of=\{\{\s*(:)?\s*(\w+(?:\.\w+)*)\s*\}\}\s*>/gs,

    replacement: (_, ...[scope, variable]) =>
    {
      const prefix = scope === ':' ? '' : 'self.';
      const path = variable.replaceAll('.', '?.');

      return `\${(()=>{const a=${ prefix + path };return `;
    }
  },
  whenEnd: { pattern: /<\/when>/gs, replacement: `'';})()}` },

  /**
   * Case block (`<case>`, `<default>`).
   * This allows for multi-way branching based on a variable's value.
   */
  case:
  {
    pattern: /<case\s+is="\s*(\w+)\s*">/gs,

    replacement: (_, ...[value]) =>
    {
      return `(c(a,'${ value.replaceAll(`'`, `\\'`) }')&&\``;
    }
  },
  default: { pattern: /<default>/gs, replacement: `(\`` },
  caseEnd: { pattern: /<\/(?:case|default)>/gs, replacement: `\`)||` }
};

/**
 * Parses the template string and applies all element transformations.
 * 
 * @param template - The template string to be parsed.
 * @returns The transformed template string with all elements parsed.
 */
const parseElements = (template: Template): Template =>
{
  // block attempts to break out of the template
  template = template.replaceAll(/\$(?=\{)/gs, '\\$');

  Object.values(elements).forEach(
    (element) =>
    {
      const { pattern, replacement } = element;

      // @ts-ignore - the custom type isn't accepted by the compiler.
      template = template.replaceAll(pattern, replacement);
    }
  );

  return template;
};

/**
 * Compiles all dependency templates into render function definitions.
 * 
 * @param dependencies - An object containing dependencies to be compiled.
 * @returns A string containing the compiled dependencies.
 */
const compileDependencies = (dependencies: Dependencies): string =>
{
  const result = Object.entries(dependencies).map(
    ([name, template]) => 
    {
      if (typeof template !== 'string')
      {
        throw new Error(
          `Invalid template type for dependency (${ name }). Expected a raw or precompiled string.`
        );
      }

      return template.startsWith('(self,parent)=>{')
        ? `const __${ name }=${ template };` // precompiled template.
        : `const __${ name }=${ compile.toString(template, undefined, { helpers: false }) };`;
    }
  );
  return result.join('');
};

/**
 * Compiles the full template body as a stringified render function.
 * 
 * @param template - The template string to be compiled.
 * @param dependencies - An object containing dependencies to be compiled.
 * @param helpers - ?
 * @returns A string containing the compiled template body.
 */
const compileTemplate = (template: Template,
  dependencies: Dependencies = {}, helpers: boolean = true): string =>
{
  const helperFunctions =
    `const v=(t)=>typeof t==='function'?t():t;` +
    `const c=(a,b)=>typeof a==='number'?a===parseInt(b):a===b;` +
    `const s=(t)=>typeof t!=='string'?t?.toString():t;` +
    `const e=(t)=>typeof t==='string'&&t.replaceAll('<','&lt;').replaceAll('>','&gt;')||t;` +
    `const r=(t)=>Array.isArray(t)?t.length>0:(t!==false&&t!==null&&t!==undefined);`;

  let body = [
    `self=self||{};parent=parent||{};`,
    helpers !== false ? helperFunctions : '',
    compileDependencies(dependencies),
    `if(self.__children){self.__children_r=self.__children()}`,
    `return \`${ parseElements(template) }\`;`
  ];

  return body.join('');
};

/**
 * * The `compile` API provides methods to compile templates into render functions.
 * * It includes methods to convert templates into both function and string formats.
 */
export const compile =
{
  /**
   * Compiles a template and its optional dependencies into a render function.
   * 
   * @param template - The template string to be compiled.
   * @param dependencies - An object containing dependencies to be compiled.
   * @param options - Optional settings for the compilation process.
   * @return A render function that can be used to render the template.
   */
  toFunction: (
    template: Template, dependencies: Dependencies = {},
    { helpers, recursive }: Options = {}): RenderFunction =>
  {
    if (recursive === true)
    {
      dependencies.self = template;
    }

    const body = compileTemplate(template, dependencies, helpers);
    return new Function('self', 'parent', body) as RenderFunction;
  },

  /**
   * Compiles a template and its dependencies into a string representation of a render function.
   * 
   * @param template - The template string to be compiled.
   * @param dependencies - An object containing dependencies to be compiled.
   * @param options - Optional settings for the compilation process.
   * @return A string representation of the render function.
   */
  toString: (
    template: Template, dependencies: Dependencies = {},
    { helpers, recursive }: Options = {}): string =>
  {
    if (recursive === true)
    {
      dependencies.self = template;
    }

    return `(self,parent)=>{${ compileTemplate(template, dependencies, helpers) }}`;
  }
};
