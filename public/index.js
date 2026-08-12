(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/prismjs/prism.js
  var require_prism = __commonJS({
    "node_modules/prismjs/prism.js"(exports, module) {
      var _self = typeof window !== "undefined" ? window : typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope ? self : {};
      /**
       * Prism: Lightweight, robust, elegant syntax highlighting
       *
       * @license MIT <https://opensource.org/licenses/MIT>
       * @author Lea Verou <https://lea.verou.me>
       * @namespace
       * @public
       */
      var Prism3 = (function(_self2) {
        var lang = /(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i;
        var uniqueId = 0;
        var plainTextGrammar = {};
        var _ = {
          /**
           * By default, Prism will attempt to highlight all code elements (by calling {@link Prism.highlightAll}) on the
           * current page after the page finished loading. This might be a problem if e.g. you wanted to asynchronously load
           * additional languages or plugins yourself.
           *
           * By setting this value to `true`, Prism will not automatically highlight all code elements on the page.
           *
           * You obviously have to change this value before the automatic highlighting started. To do this, you can add an
           * empty Prism object into the global scope before loading the Prism script like this:
           *
           * ```js
           * window.Prism = window.Prism || {};
           * Prism.manual = true;
           * // add a new <script> to load Prism's script
           * ```
           *
           * @default false
           * @type {boolean}
           * @memberof Prism
           * @public
           */
          manual: _self2.Prism && _self2.Prism.manual,
          /**
           * By default, if Prism is in a web worker, it assumes that it is in a worker it created itself, so it uses
           * `addEventListener` to communicate with its parent instance. However, if you're using Prism manually in your
           * own worker, you don't want it to do this.
           *
           * By setting this value to `true`, Prism will not add its own listeners to the worker.
           *
           * You obviously have to change this value before Prism executes. To do this, you can add an
           * empty Prism object into the global scope before loading the Prism script like this:
           *
           * ```js
           * window.Prism = window.Prism || {};
           * Prism.disableWorkerMessageHandler = true;
           * // Load Prism's script
           * ```
           *
           * @default false
           * @type {boolean}
           * @memberof Prism
           * @public
           */
          disableWorkerMessageHandler: _self2.Prism && _self2.Prism.disableWorkerMessageHandler,
          /**
           * A namespace for utility methods.
           *
           * All function in this namespace that are not explicitly marked as _public_ are for __internal use only__ and may
           * change or disappear at any time.
           *
           * @namespace
           * @memberof Prism
           */
          util: {
            encode: function encode(tokens) {
              if (tokens instanceof Token) {
                return new Token(tokens.type, encode(tokens.content), tokens.alias);
              } else if (Array.isArray(tokens)) {
                return tokens.map(encode);
              } else {
                return tokens.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\u00a0/g, " ");
              }
            },
            /**
             * Returns the name of the type of the given value.
             *
             * @param {any} o
             * @returns {string}
             * @example
             * type(null)      === 'Null'
             * type(undefined) === 'Undefined'
             * type(123)       === 'Number'
             * type('foo')     === 'String'
             * type(true)      === 'Boolean'
             * type([1, 2])    === 'Array'
             * type({})        === 'Object'
             * type(String)    === 'Function'
             * type(/abc+/)    === 'RegExp'
             */
            type: function(o) {
              return Object.prototype.toString.call(o).slice(8, -1);
            },
            /**
             * Returns a unique number for the given object. Later calls will still return the same number.
             *
             * @param {Object} obj
             * @returns {number}
             */
            objId: function(obj) {
              if (!obj["__id"]) {
                Object.defineProperty(obj, "__id", { value: ++uniqueId });
              }
              return obj["__id"];
            },
            /**
             * Creates a deep clone of the given object.
             *
             * The main intended use of this function is to clone language definitions.
             *
             * @param {T} o
             * @param {Record<number, any>} [visited]
             * @returns {T}
             * @template T
             */
            clone: function deepClone(o, visited) {
              visited = visited || {};
              var clone;
              var id;
              switch (_.util.type(o)) {
                case "Object":
                  id = _.util.objId(o);
                  if (visited[id]) {
                    return visited[id];
                  }
                  clone = /** @type {Record<string, any>} */
                  {};
                  visited[id] = clone;
                  for (var key in o) {
                    if (o.hasOwnProperty(key)) {
                      clone[key] = deepClone(o[key], visited);
                    }
                  }
                  return (
                    /** @type {any} */
                    clone
                  );
                case "Array":
                  id = _.util.objId(o);
                  if (visited[id]) {
                    return visited[id];
                  }
                  clone = [];
                  visited[id] = clone;
                  /** @type {Array} */
                  /** @type {any} */
                  o.forEach(function(v, i) {
                    clone[i] = deepClone(v, visited);
                  });
                  return (
                    /** @type {any} */
                    clone
                  );
                default:
                  return o;
              }
            },
            /**
             * Returns the Prism language of the given element set by a `language-xxxx` or `lang-xxxx` class.
             *
             * If no language is set for the element or the element is `null` or `undefined`, `none` will be returned.
             *
             * @param {Element} element
             * @returns {string}
             */
            getLanguage: function(element) {
              while (element) {
                var m = lang.exec(element.className);
                if (m) {
                  return m[1].toLowerCase();
                }
                element = element.parentElement;
              }
              return "none";
            },
            /**
             * Sets the Prism `language-xxxx` class of the given element.
             *
             * @param {Element} element
             * @param {string} language
             * @returns {void}
             */
            setLanguage: function(element, language) {
              element.className = element.className.replace(RegExp(lang, "gi"), "");
              element.classList.add("language-" + language);
            },
            /**
             * Returns the script element that is currently executing.
             *
             * This does __not__ work for line script element.
             *
             * @returns {HTMLScriptElement | null}
             */
            currentScript: function() {
              if (typeof document === "undefined") {
                return null;
              }
              if (document.currentScript && document.currentScript.tagName === "SCRIPT" && 1 < 2) {
                return (
                  /** @type {any} */
                  document.currentScript
                );
              }
              try {
                throw new Error();
              } catch (err) {
                var src = (/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(err.stack) || [])[1];
                if (src) {
                  var scripts = document.getElementsByTagName("script");
                  for (var i in scripts) {
                    if (scripts[i].src == src) {
                      return scripts[i];
                    }
                  }
                }
                return null;
              }
            },
            /**
             * Returns whether a given class is active for `element`.
             *
             * The class can be activated if `element` or one of its ancestors has the given class and it can be deactivated
             * if `element` or one of its ancestors has the negated version of the given class. The _negated version_ of the
             * given class is just the given class with a `no-` prefix.
             *
             * Whether the class is active is determined by the closest ancestor of `element` (where `element` itself is
             * closest ancestor) that has the given class or the negated version of it. If neither `element` nor any of its
             * ancestors have the given class or the negated version of it, then the default activation will be returned.
             *
             * In the paradoxical situation where the closest ancestor contains __both__ the given class and the negated
             * version of it, the class is considered active.
             *
             * @param {Element} element
             * @param {string} className
             * @param {boolean} [defaultActivation=false]
             * @returns {boolean}
             */
            isActive: function(element, className, defaultActivation) {
              var no = "no-" + className;
              while (element) {
                var classList = element.classList;
                if (classList.contains(className)) {
                  return true;
                }
                if (classList.contains(no)) {
                  return false;
                }
                element = element.parentElement;
              }
              return !!defaultActivation;
            }
          },
          /**
           * This namespace contains all currently loaded languages and the some helper functions to create and modify languages.
           *
           * @namespace
           * @memberof Prism
           * @public
           */
          languages: {
            /**
             * The grammar for plain, unformatted text.
             */
            plain: plainTextGrammar,
            plaintext: plainTextGrammar,
            text: plainTextGrammar,
            txt: plainTextGrammar,
            /**
             * Creates a deep copy of the language with the given id and appends the given tokens.
             *
             * If a token in `redef` also appears in the copied language, then the existing token in the copied language
             * will be overwritten at its original position.
             *
             * ## Best practices
             *
             * Since the position of overwriting tokens (token in `redef` that overwrite tokens in the copied language)
             * doesn't matter, they can technically be in any order. However, this can be confusing to others that trying to
             * understand the language definition because, normally, the order of tokens matters in Prism grammars.
             *
             * Therefore, it is encouraged to order overwriting tokens according to the positions of the overwritten tokens.
             * Furthermore, all non-overwriting tokens should be placed after the overwriting ones.
             *
             * @param {string} id The id of the language to extend. This has to be a key in `Prism.languages`.
             * @param {Grammar} redef The new tokens to append.
             * @returns {Grammar} The new language created.
             * @public
             * @example
             * Prism.languages['css-with-colors'] = Prism.languages.extend('css', {
             *     // Prism.languages.css already has a 'comment' token, so this token will overwrite CSS' 'comment' token
             *     // at its original position
             *     'comment': { ... },
             *     // CSS doesn't have a 'color' token, so this token will be appended
             *     'color': /\b(?:red|green|blue)\b/
             * });
             */
            extend: function(id, redef) {
              var lang2 = _.util.clone(_.languages[id]);
              for (var key in redef) {
                lang2[key] = redef[key];
              }
              return lang2;
            },
            /**
             * Inserts tokens _before_ another token in a language definition or any other grammar.
             *
             * ## Usage
             *
             * This helper method makes it easy to modify existing languages. For example, the CSS language definition
             * not only defines CSS highlighting for CSS documents, but also needs to define highlighting for CSS embedded
             * in HTML through `<style>` elements. To do this, it needs to modify `Prism.languages.markup` and add the
             * appropriate tokens. However, `Prism.languages.markup` is a regular JavaScript object literal, so if you do
             * this:
             *
             * ```js
             * Prism.languages.markup.style = {
             *     // token
             * };
             * ```
             *
             * then the `style` token will be added (and processed) at the end. `insertBefore` allows you to insert tokens
             * before existing tokens. For the CSS example above, you would use it like this:
             *
             * ```js
             * Prism.languages.insertBefore('markup', 'cdata', {
             *     'style': {
             *         // token
             *     }
             * });
             * ```
             *
             * ## Special cases
             *
             * If the grammars of `inside` and `insert` have tokens with the same name, the tokens in `inside`'s grammar
             * will be ignored.
             *
             * This behavior can be used to insert tokens after `before`:
             *
             * ```js
             * Prism.languages.insertBefore('markup', 'comment', {
             *     'comment': Prism.languages.markup.comment,
             *     // tokens after 'comment'
             * });
             * ```
             *
             * ## Limitations
             *
             * The main problem `insertBefore` has to solve is iteration order. Since ES2015, the iteration order for object
             * properties is guaranteed to be the insertion order (except for integer keys) but some browsers behave
             * differently when keys are deleted and re-inserted. So `insertBefore` can't be implemented by temporarily
             * deleting properties which is necessary to insert at arbitrary positions.
             *
             * To solve this problem, `insertBefore` doesn't actually insert the given tokens into the target object.
             * Instead, it will create a new object and replace all references to the target object with the new one. This
             * can be done without temporarily deleting properties, so the iteration order is well-defined.
             *
             * However, only references that can be reached from `Prism.languages` or `insert` will be replaced. I.e. if
             * you hold the target object in a variable, then the value of the variable will not change.
             *
             * ```js
             * var oldMarkup = Prism.languages.markup;
             * var newMarkup = Prism.languages.insertBefore('markup', 'comment', { ... });
             *
             * assert(oldMarkup !== Prism.languages.markup);
             * assert(newMarkup === Prism.languages.markup);
             * ```
             *
             * @param {string} inside The property of `root` (e.g. a language id in `Prism.languages`) that contains the
             * object to be modified.
             * @param {string} before The key to insert before.
             * @param {Grammar} insert An object containing the key-value pairs to be inserted.
             * @param {Object<string, any>} [root] The object containing `inside`, i.e. the object that contains the
             * object to be modified.
             *
             * Defaults to `Prism.languages`.
             * @returns {Grammar} The new grammar object.
             * @public
             */
            insertBefore: function(inside, before, insert, root) {
              root = root || /** @type {any} */
              _.languages;
              var grammar = root[inside];
              var ret = {};
              for (var token in grammar) {
                if (grammar.hasOwnProperty(token)) {
                  if (token == before) {
                    for (var newToken in insert) {
                      if (insert.hasOwnProperty(newToken)) {
                        ret[newToken] = insert[newToken];
                      }
                    }
                  }
                  if (!insert.hasOwnProperty(token)) {
                    ret[token] = grammar[token];
                  }
                }
              }
              var old = root[inside];
              root[inside] = ret;
              _.languages.DFS(_.languages, function(key, value) {
                if (value === old && key != inside) {
                  this[key] = ret;
                }
              });
              return ret;
            },
            // Traverse a language definition with Depth First Search
            DFS: function DFS(o, callback, type, visited) {
              visited = visited || {};
              var objId = _.util.objId;
              for (var i in o) {
                if (o.hasOwnProperty(i)) {
                  callback.call(o, i, o[i], type || i);
                  var property = o[i];
                  var propertyType = _.util.type(property);
                  if (propertyType === "Object" && !visited[objId(property)]) {
                    visited[objId(property)] = true;
                    DFS(property, callback, null, visited);
                  } else if (propertyType === "Array" && !visited[objId(property)]) {
                    visited[objId(property)] = true;
                    DFS(property, callback, i, visited);
                  }
                }
              }
            }
          },
          plugins: {},
          /**
           * This is the most high-level function in Prism’s API.
           * It fetches all the elements that have a `.language-xxxx` class and then calls {@link Prism.highlightElement} on
           * each one of them.
           *
           * This is equivalent to `Prism.highlightAllUnder(document, async, callback)`.
           *
           * @param {boolean} [async=false] Same as in {@link Prism.highlightAllUnder}.
           * @param {HighlightCallback} [callback] Same as in {@link Prism.highlightAllUnder}.
           * @memberof Prism
           * @public
           */
          highlightAll: function(async, callback) {
            _.highlightAllUnder(document, async, callback);
          },
          /**
           * Fetches all the descendants of `container` that have a `.language-xxxx` class and then calls
           * {@link Prism.highlightElement} on each one of them.
           *
           * The following hooks will be run:
           * 1. `before-highlightall`
           * 2. `before-all-elements-highlight`
           * 3. All hooks of {@link Prism.highlightElement} for each element.
           *
           * @param {ParentNode} container The root element, whose descendants that have a `.language-xxxx` class will be highlighted.
           * @param {boolean} [async=false] Whether each element is to be highlighted asynchronously using Web Workers.
           * @param {HighlightCallback} [callback] An optional callback to be invoked on each element after its highlighting is done.
           * @memberof Prism
           * @public
           */
          highlightAllUnder: function(container, async, callback) {
            var env = {
              callback,
              container,
              selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
            };
            _.hooks.run("before-highlightall", env);
            env.elements = Array.prototype.slice.apply(env.container.querySelectorAll(env.selector));
            _.hooks.run("before-all-elements-highlight", env);
            for (var i = 0, element; element = env.elements[i++]; ) {
              _.highlightElement(element, async === true, env.callback);
            }
          },
          /**
           * Highlights the code inside a single element.
           *
           * The following hooks will be run:
           * 1. `before-sanity-check`
           * 2. `before-highlight`
           * 3. All hooks of {@link Prism.highlight}. These hooks will be run by an asynchronous worker if `async` is `true`.
           * 4. `before-insert`
           * 5. `after-highlight`
           * 6. `complete`
           *
           * Some the above hooks will be skipped if the element doesn't contain any text or there is no grammar loaded for
           * the element's language.
           *
           * @param {Element} element The element containing the code.
           * It must have a class of `language-xxxx` to be processed, where `xxxx` is a valid language identifier.
           * @param {boolean} [async=false] Whether the element is to be highlighted asynchronously using Web Workers
           * to improve performance and avoid blocking the UI when highlighting very large chunks of code. This option is
           * [disabled by default](https://prismjs.com/faq.html#why-is-asynchronous-highlighting-disabled-by-default).
           *
           * Note: All language definitions required to highlight the code must be included in the main `prism.js` file for
           * asynchronous highlighting to work. You can build your own bundle on the
           * [Download page](https://prismjs.com/download.html).
           * @param {HighlightCallback} [callback] An optional callback to be invoked after the highlighting is done.
           * Mostly useful when `async` is `true`, since in that case, the highlighting is done asynchronously.
           * @memberof Prism
           * @public
           */
          highlightElement: function(element, async, callback) {
            var language = _.util.getLanguage(element);
            var grammar = _.languages[language];
            _.util.setLanguage(element, language);
            var parent = element.parentElement;
            if (parent && parent.nodeName.toLowerCase() === "pre") {
              _.util.setLanguage(parent, language);
            }
            var code = element.textContent;
            var env = {
              element,
              language,
              grammar,
              code
            };
            function insertHighlightedCode(highlightedCode) {
              env.highlightedCode = highlightedCode;
              _.hooks.run("before-insert", env);
              env.element.innerHTML = env.highlightedCode;
              _.hooks.run("after-highlight", env);
              _.hooks.run("complete", env);
              callback && callback.call(env.element);
            }
            _.hooks.run("before-sanity-check", env);
            parent = env.element.parentElement;
            if (parent && parent.nodeName.toLowerCase() === "pre" && !parent.hasAttribute("tabindex")) {
              parent.setAttribute("tabindex", "0");
            }
            if (!env.code) {
              _.hooks.run("complete", env);
              callback && callback.call(env.element);
              return;
            }
            _.hooks.run("before-highlight", env);
            if (!env.grammar) {
              insertHighlightedCode(_.util.encode(env.code));
              return;
            }
            if (async && _self2.Worker) {
              var worker = new Worker(_.filename);
              worker.onmessage = function(evt) {
                insertHighlightedCode(evt.data);
              };
              worker.postMessage(JSON.stringify({
                language: env.language,
                code: env.code,
                immediateClose: true
              }));
            } else {
              insertHighlightedCode(_.highlight(env.code, env.grammar, env.language));
            }
          },
          /**
           * Low-level function, only use if you know what you’re doing. It accepts a string of text as input
           * and the language definitions to use, and returns a string with the HTML produced.
           *
           * The following hooks will be run:
           * 1. `before-tokenize`
           * 2. `after-tokenize`
           * 3. `wrap`: On each {@link Token}.
           *
           * @param {string} text A string with the code to be highlighted.
           * @param {Grammar} grammar An object containing the tokens to use.
           *
           * Usually a language definition like `Prism.languages.markup`.
           * @param {string} language The name of the language definition passed to `grammar`.
           * @returns {string} The highlighted HTML.
           * @memberof Prism
           * @public
           * @example
           * Prism.highlight('var foo = true;', Prism.languages.javascript, 'javascript');
           */
          highlight: function(text, grammar, language) {
            var env = {
              code: text,
              grammar,
              language
            };
            _.hooks.run("before-tokenize", env);
            if (!env.grammar) {
              throw new Error('The language "' + env.language + '" has no grammar.');
            }
            env.tokens = _.tokenize(env.code, env.grammar);
            _.hooks.run("after-tokenize", env);
            return Token.stringify(_.util.encode(env.tokens), env.language);
          },
          /**
           * This is the heart of Prism, and the most low-level function you can use. It accepts a string of text as input
           * and the language definitions to use, and returns an array with the tokenized code.
           *
           * When the language definition includes nested tokens, the function is called recursively on each of these tokens.
           *
           * This method could be useful in other contexts as well, as a very crude parser.
           *
           * @param {string} text A string with the code to be highlighted.
           * @param {Grammar} grammar An object containing the tokens to use.
           *
           * Usually a language definition like `Prism.languages.markup`.
           * @returns {TokenStream} An array of strings and tokens, a token stream.
           * @memberof Prism
           * @public
           * @example
           * let code = `var foo = 0;`;
           * let tokens = Prism.tokenize(code, Prism.languages.javascript);
           * tokens.forEach(token => {
           *     if (token instanceof Prism.Token && token.type === 'number') {
           *         console.log(`Found numeric literal: ${token.content}`);
           *     }
           * });
           */
          tokenize: function(text, grammar) {
            var rest = grammar.rest;
            if (rest) {
              for (var token in rest) {
                grammar[token] = rest[token];
              }
              delete grammar.rest;
            }
            var tokenList = new LinkedList();
            addAfter(tokenList, tokenList.head, text);
            matchGrammar(text, tokenList, grammar, tokenList.head, 0);
            return toArray(tokenList);
          },
          /**
           * @namespace
           * @memberof Prism
           * @public
           */
          hooks: {
            all: {},
            /**
             * Adds the given callback to the list of callbacks for the given hook.
             *
             * The callback will be invoked when the hook it is registered for is run.
             * Hooks are usually directly run by a highlight function but you can also run hooks yourself.
             *
             * One callback function can be registered to multiple hooks and the same hook multiple times.
             *
             * @param {string} name The name of the hook.
             * @param {HookCallback} callback The callback function which is given environment variables.
             * @public
             */
            add: function(name, callback) {
              var hooks = _.hooks.all;
              hooks[name] = hooks[name] || [];
              hooks[name].push(callback);
            },
            /**
             * Runs a hook invoking all registered callbacks with the given environment variables.
             *
             * Callbacks will be invoked synchronously and in the order in which they were registered.
             *
             * @param {string} name The name of the hook.
             * @param {Object<string, any>} env The environment variables of the hook passed to all callbacks registered.
             * @public
             */
            run: function(name, env) {
              var callbacks = _.hooks.all[name];
              if (!callbacks || !callbacks.length) {
                return;
              }
              for (var i = 0, callback; callback = callbacks[i++]; ) {
                callback(env);
              }
            }
          },
          Token
        };
        _self2.Prism = _;
        function Token(type, content, alias, matchedStr) {
          this.type = type;
          this.content = content;
          this.alias = alias;
          this.length = (matchedStr || "").length | 0;
        }
        Token.stringify = function stringify(o, language) {
          if (typeof o == "string") {
            return o;
          }
          if (Array.isArray(o)) {
            var s = "";
            o.forEach(function(e) {
              s += stringify(e, language);
            });
            return s;
          }
          var env = {
            type: o.type,
            content: stringify(o.content, language),
            tag: "span",
            classes: ["token", o.type],
            attributes: {},
            language
          };
          var aliases = o.alias;
          if (aliases) {
            if (Array.isArray(aliases)) {
              Array.prototype.push.apply(env.classes, aliases);
            } else {
              env.classes.push(aliases);
            }
          }
          _.hooks.run("wrap", env);
          var attributes = "";
          for (var name in env.attributes) {
            attributes += " " + name + '="' + (env.attributes[name] || "").replace(/"/g, "&quot;") + '"';
          }
          return "<" + env.tag + ' class="' + env.classes.join(" ") + '"' + attributes + ">" + env.content + "</" + env.tag + ">";
        };
        function matchPattern(pattern, pos, text, lookbehind) {
          pattern.lastIndex = pos;
          var match = pattern.exec(text);
          if (match && lookbehind && match[1]) {
            var lookbehindLength = match[1].length;
            match.index += lookbehindLength;
            match[0] = match[0].slice(lookbehindLength);
          }
          return match;
        }
        function matchGrammar(text, tokenList, grammar, startNode, startPos, rematch) {
          for (var token in grammar) {
            if (!grammar.hasOwnProperty(token) || !grammar[token]) {
              continue;
            }
            var patterns = grammar[token];
            patterns = Array.isArray(patterns) ? patterns : [patterns];
            for (var j = 0; j < patterns.length; ++j) {
              if (rematch && rematch.cause == token + "," + j) {
                return;
              }
              var patternObj = patterns[j];
              var inside = patternObj.inside;
              var lookbehind = !!patternObj.lookbehind;
              var greedy = !!patternObj.greedy;
              var alias = patternObj.alias;
              if (greedy && !patternObj.pattern.global) {
                var flags = patternObj.pattern.toString().match(/[imsuy]*$/)[0];
                patternObj.pattern = RegExp(patternObj.pattern.source, flags + "g");
              }
              var pattern = patternObj.pattern || patternObj;
              for (var currentNode = startNode.next, pos = startPos; currentNode !== tokenList.tail; pos += currentNode.value.length, currentNode = currentNode.next) {
                if (rematch && pos >= rematch.reach) {
                  break;
                }
                var str = currentNode.value;
                if (tokenList.length > text.length) {
                  return;
                }
                if (str instanceof Token) {
                  continue;
                }
                var removeCount = 1;
                var match;
                if (greedy) {
                  match = matchPattern(pattern, pos, text, lookbehind);
                  if (!match || match.index >= text.length) {
                    break;
                  }
                  var from = match.index;
                  var to = match.index + match[0].length;
                  var p = pos;
                  p += currentNode.value.length;
                  while (from >= p) {
                    currentNode = currentNode.next;
                    p += currentNode.value.length;
                  }
                  p -= currentNode.value.length;
                  pos = p;
                  if (currentNode.value instanceof Token) {
                    continue;
                  }
                  for (var k = currentNode; k !== tokenList.tail && (p < to || typeof k.value === "string"); k = k.next) {
                    removeCount++;
                    p += k.value.length;
                  }
                  removeCount--;
                  str = text.slice(pos, p);
                  match.index -= pos;
                } else {
                  match = matchPattern(pattern, 0, str, lookbehind);
                  if (!match) {
                    continue;
                  }
                }
                var from = match.index;
                var matchStr = match[0];
                var before = str.slice(0, from);
                var after = str.slice(from + matchStr.length);
                var reach = pos + str.length;
                if (rematch && reach > rematch.reach) {
                  rematch.reach = reach;
                }
                var removeFrom = currentNode.prev;
                if (before) {
                  removeFrom = addAfter(tokenList, removeFrom, before);
                  pos += before.length;
                }
                removeRange(tokenList, removeFrom, removeCount);
                var wrapped = new Token(token, inside ? _.tokenize(matchStr, inside) : matchStr, alias, matchStr);
                currentNode = addAfter(tokenList, removeFrom, wrapped);
                if (after) {
                  addAfter(tokenList, currentNode, after);
                }
                if (removeCount > 1) {
                  var nestedRematch = {
                    cause: token + "," + j,
                    reach
                  };
                  matchGrammar(text, tokenList, grammar, currentNode.prev, pos, nestedRematch);
                  if (rematch && nestedRematch.reach > rematch.reach) {
                    rematch.reach = nestedRematch.reach;
                  }
                }
              }
            }
          }
        }
        function LinkedList() {
          var head = { value: null, prev: null, next: null };
          var tail = { value: null, prev: head, next: null };
          head.next = tail;
          this.head = head;
          this.tail = tail;
          this.length = 0;
        }
        function addAfter(list, node, value) {
          var next = node.next;
          var newNode = { value, prev: node, next };
          node.next = newNode;
          next.prev = newNode;
          list.length++;
          return newNode;
        }
        function removeRange(list, node, count) {
          var next = node.next;
          for (var i = 0; i < count && next !== list.tail; i++) {
            next = next.next;
          }
          node.next = next;
          next.prev = node;
          list.length -= i;
        }
        function toArray(list) {
          var array = [];
          var node = list.head.next;
          while (node !== list.tail) {
            array.push(node.value);
            node = node.next;
          }
          return array;
        }
        if (!_self2.document) {
          if (!_self2.addEventListener) {
            return _;
          }
          if (!_.disableWorkerMessageHandler) {
            _self2.addEventListener("message", function(evt) {
              var message = JSON.parse(evt.data);
              var lang2 = message.language;
              var code = message.code;
              var immediateClose = message.immediateClose;
              _self2.postMessage(_.highlight(code, _.languages[lang2], lang2));
              if (immediateClose) {
                _self2.close();
              }
            }, false);
          }
          return _;
        }
        var script = _.util.currentScript();
        if (script) {
          _.filename = script.src;
          if (script.hasAttribute("data-manual")) {
            _.manual = true;
          }
        }
        function highlightAutomaticallyCallback() {
          if (!_.manual) {
            _.highlightAll();
          }
        }
        if (!_.manual) {
          var readyState = document.readyState;
          if (readyState === "loading" || readyState === "interactive" && script && script.defer) {
            document.addEventListener("DOMContentLoaded", highlightAutomaticallyCallback);
          } else {
            if (window.requestAnimationFrame) {
              window.requestAnimationFrame(highlightAutomaticallyCallback);
            } else {
              window.setTimeout(highlightAutomaticallyCallback, 16);
            }
          }
        }
        return _;
      })(_self);
      if (typeof module !== "undefined" && module.exports) {
        module.exports = Prism3;
      }
      if (typeof global !== "undefined") {
        global.Prism = Prism3;
      }
      Prism3.languages.markup = {
        "comment": {
          pattern: /<!--(?:(?!<!--)[\s\S])*?-->/,
          greedy: true
        },
        "prolog": {
          pattern: /<\?[\s\S]+?\?>/,
          greedy: true
        },
        "doctype": {
          // https://www.w3.org/TR/xml/#NT-doctypedecl
          pattern: /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
          greedy: true,
          inside: {
            "internal-subset": {
              pattern: /(^[^\[]*\[)[\s\S]+(?=\]>$)/,
              lookbehind: true,
              greedy: true,
              inside: null
              // see below
            },
            "string": {
              pattern: /"[^"]*"|'[^']*'/,
              greedy: true
            },
            "punctuation": /^<!|>$|[[\]]/,
            "doctype-tag": /^DOCTYPE/i,
            "name": /[^\s<>'"]+/
          }
        },
        "cdata": {
          pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
          greedy: true
        },
        "tag": {
          pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
          greedy: true,
          inside: {
            "tag": {
              pattern: /^<\/?[^\s>\/]+/,
              inside: {
                "punctuation": /^<\/?/,
                "namespace": /^[^\s>\/:]+:/
              }
            },
            "special-attr": [],
            "attr-value": {
              pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
              inside: {
                "punctuation": [
                  {
                    pattern: /^=/,
                    alias: "attr-equals"
                  },
                  {
                    pattern: /^(\s*)["']|["']$/,
                    lookbehind: true
                  }
                ]
              }
            },
            "punctuation": /\/?>/,
            "attr-name": {
              pattern: /[^\s>\/]+/,
              inside: {
                "namespace": /^[^\s>\/:]+:/
              }
            }
          }
        },
        "entity": [
          {
            pattern: /&[\da-z]{1,8};/i,
            alias: "named-entity"
          },
          /&#x?[\da-f]{1,8};/i
        ]
      };
      Prism3.languages.markup["tag"].inside["attr-value"].inside["entity"] = Prism3.languages.markup["entity"];
      Prism3.languages.markup["doctype"].inside["internal-subset"].inside = Prism3.languages.markup;
      Prism3.hooks.add("wrap", function(env) {
        if (env.type === "entity") {
          env.attributes["title"] = env.content.replace(/&amp;/, "&");
        }
      });
      Object.defineProperty(Prism3.languages.markup.tag, "addInlined", {
        /**
         * Adds an inlined language to markup.
         *
         * An example of an inlined language is CSS with `<style>` tags.
         *
         * @param {string} tagName The name of the tag that contains the inlined language. This name will be treated as
         * case insensitive.
         * @param {string} lang The language key.
         * @example
         * addInlined('style', 'css');
         */
        value: function addInlined(tagName, lang) {
          var includedCdataInside = {};
          includedCdataInside["language-" + lang] = {
            pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
            lookbehind: true,
            inside: Prism3.languages[lang]
          };
          includedCdataInside["cdata"] = /^<!\[CDATA\[|\]\]>$/i;
          var inside = {
            "included-cdata": {
              pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
              inside: includedCdataInside
            }
          };
          inside["language-" + lang] = {
            pattern: /[\s\S]+/,
            inside: Prism3.languages[lang]
          };
          var def = {};
          def[tagName] = {
            pattern: RegExp(/(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g, function() {
              return tagName;
            }), "i"),
            lookbehind: true,
            greedy: true,
            inside
          };
          Prism3.languages.insertBefore("markup", "cdata", def);
        }
      });
      Object.defineProperty(Prism3.languages.markup.tag, "addAttribute", {
        /**
         * Adds an pattern to highlight languages embedded in HTML attributes.
         *
         * An example of an inlined language is CSS with `style` attributes.
         *
         * @param {string} attrName The name of the tag that contains the inlined language. This name will be treated as
         * case insensitive.
         * @param {string} lang The language key.
         * @example
         * addAttribute('style', 'css');
         */
        value: function(attrName, lang) {
          Prism3.languages.markup.tag.inside["special-attr"].push({
            pattern: RegExp(
              /(^|["'\s])/.source + "(?:" + attrName + ")" + /\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,
              "i"
            ),
            lookbehind: true,
            inside: {
              "attr-name": /^[^\s=]+/,
              "attr-value": {
                pattern: /=[\s\S]+/,
                inside: {
                  "value": {
                    pattern: /(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,
                    lookbehind: true,
                    alias: [lang, "language-" + lang],
                    inside: Prism3.languages[lang]
                  },
                  "punctuation": [
                    {
                      pattern: /^=/,
                      alias: "attr-equals"
                    },
                    /"|'/
                  ]
                }
              }
            }
          });
        }
      });
      Prism3.languages.html = Prism3.languages.markup;
      Prism3.languages.mathml = Prism3.languages.markup;
      Prism3.languages.svg = Prism3.languages.markup;
      Prism3.languages.xml = Prism3.languages.extend("markup", {});
      Prism3.languages.ssml = Prism3.languages.xml;
      Prism3.languages.atom = Prism3.languages.xml;
      Prism3.languages.rss = Prism3.languages.xml;
      (function(Prism4) {
        var string = /(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;
        Prism4.languages.css = {
          "comment": /\/\*[\s\S]*?\*\//,
          "atrule": {
            pattern: RegExp("@[\\w-](?:" + /[^;{\s"']|\s+(?!\s)/.source + "|" + string.source + ")*?" + /(?:;|(?=\s*\{))/.source),
            inside: {
              "rule": /^@[\w-]+/,
              "selector-function-argument": {
                pattern: /(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,
                lookbehind: true,
                alias: "selector"
              },
              "keyword": {
                pattern: /(^|[^\w-])(?:and|not|only|or)(?![\w-])/,
                lookbehind: true
              }
              // See rest below
            }
          },
          "url": {
            // https://drafts.csswg.org/css-values-3/#urls
            pattern: RegExp("\\burl\\((?:" + string.source + "|" + /(?:[^\\\r\n()"']|\\[\s\S])*/.source + ")\\)", "i"),
            greedy: true,
            inside: {
              "function": /^url/i,
              "punctuation": /^\(|\)$/,
              "string": {
                pattern: RegExp("^" + string.source + "$"),
                alias: "url"
              }
            }
          },
          "selector": {
            pattern: RegExp(`(^|[{}\\s])[^{}\\s](?:[^{};"'\\s]|\\s+(?![\\s{])|` + string.source + ")*(?=\\s*\\{)"),
            lookbehind: true
          },
          "string": {
            pattern: string,
            greedy: true
          },
          "property": {
            pattern: /(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,
            lookbehind: true
          },
          "important": /!important\b/i,
          "function": {
            pattern: /(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,
            lookbehind: true
          },
          "punctuation": /[(){};:,]/
        };
        Prism4.languages.css["atrule"].inside.rest = Prism4.languages.css;
        var markup = Prism4.languages.markup;
        if (markup) {
          markup.tag.addInlined("style", "css");
          markup.tag.addAttribute("style", "css");
        }
      })(Prism3);
      Prism3.languages.clike = {
        "comment": [
          {
            pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
            lookbehind: true,
            greedy: true
          },
          {
            pattern: /(^|[^\\:])\/\/.*/,
            lookbehind: true,
            greedy: true
          }
        ],
        "string": {
          pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
          greedy: true
        },
        "class-name": {
          pattern: /(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,
          lookbehind: true,
          inside: {
            "punctuation": /[.\\]/
          }
        },
        "keyword": /\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,
        "boolean": /\b(?:false|true)\b/,
        "function": /\b\w+(?=\()/,
        "number": /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
        "operator": /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
        "punctuation": /[{}[\];(),.:]/
      };
      Prism3.languages.javascript = Prism3.languages.extend("clike", {
        "class-name": [
          Prism3.languages.clike["class-name"],
          {
            pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,
            lookbehind: true
          }
        ],
        "keyword": [
          {
            pattern: /((?:^|\})\s*)catch\b/,
            lookbehind: true
          },
          {
            pattern: /(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
            lookbehind: true
          }
        ],
        // Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
        "function": /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
        "number": {
          pattern: RegExp(
            /(^|[^\w$])/.source + "(?:" + // constant
            (/NaN|Infinity/.source + "|" + // binary integer
            /0[bB][01]+(?:_[01]+)*n?/.source + "|" + // octal integer
            /0[oO][0-7]+(?:_[0-7]+)*n?/.source + "|" + // hexadecimal integer
            /0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source + "|" + // decimal bigint
            /\d+(?:_\d+)*n/.source + "|" + // decimal number (integer or float) but no bigint
            /(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/.source) + ")" + /(?![\w$])/.source
          ),
          lookbehind: true
        },
        "operator": /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/
      });
      Prism3.languages.javascript["class-name"][0].pattern = /(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/;
      Prism3.languages.insertBefore("javascript", "keyword", {
        "regex": {
          pattern: RegExp(
            // lookbehind
            // eslint-disable-next-line regexp/no-dupe-characters-character-class
            /((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source + // Regex pattern:
            // There are 2 regex patterns here. The RegExp set notation proposal added support for nested character
            // classes if the `v` flag is present. Unfortunately, nested CCs are both context-free and incompatible
            // with the only syntax, so we have to define 2 different regex patterns.
            /\//.source + "(?:" + /(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/.source + "|" + // `v` flag syntax. This supports 3 levels of nested character classes.
            /(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/.source + ")" + // lookahead
            /(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/.source
          ),
          lookbehind: true,
          greedy: true,
          inside: {
            "regex-source": {
              pattern: /^(\/)[\s\S]+(?=\/[a-z]*$)/,
              lookbehind: true,
              alias: "language-regex",
              inside: Prism3.languages.regex
            },
            "regex-delimiter": /^\/|\/$/,
            "regex-flags": /^[a-z]+$/
          }
        },
        // This must be declared before keyword because we use "function" inside the look-forward
        "function-variable": {
          pattern: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,
          alias: "function"
        },
        "parameter": [
          {
            pattern: /(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,
            lookbehind: true,
            inside: Prism3.languages.javascript
          },
          {
            pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,
            lookbehind: true,
            inside: Prism3.languages.javascript
          },
          {
            pattern: /(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,
            lookbehind: true,
            inside: Prism3.languages.javascript
          },
          {
            pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,
            lookbehind: true,
            inside: Prism3.languages.javascript
          }
        ],
        "constant": /\b[A-Z](?:[A-Z_]|\dx?)*\b/
      });
      Prism3.languages.insertBefore("javascript", "string", {
        "hashbang": {
          pattern: /^#!.*/,
          greedy: true,
          alias: "comment"
        },
        "template-string": {
          pattern: /`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,
          greedy: true,
          inside: {
            "template-punctuation": {
              pattern: /^`|`$/,
              alias: "string"
            },
            "interpolation": {
              pattern: /((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,
              lookbehind: true,
              inside: {
                "interpolation-punctuation": {
                  pattern: /^\$\{|\}$/,
                  alias: "punctuation"
                },
                rest: Prism3.languages.javascript
              }
            },
            "string": /[\s\S]+/
          }
        },
        "string-property": {
          pattern: /((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,
          lookbehind: true,
          greedy: true,
          alias: "property"
        }
      });
      Prism3.languages.insertBefore("javascript", "operator", {
        "literal-property": {
          pattern: /((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,
          lookbehind: true,
          alias: "property"
        }
      });
      if (Prism3.languages.markup) {
        Prism3.languages.markup.tag.addInlined("script", "javascript");
        Prism3.languages.markup.tag.addAttribute(
          /on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.source,
          "javascript"
        );
      }
      Prism3.languages.js = Prism3.languages.javascript;
      (function() {
        if (typeof Prism3 === "undefined" || typeof document === "undefined") {
          return;
        }
        if (!Element.prototype.matches) {
          Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
        }
        var LOADING_MESSAGE = "Loading\u2026";
        var FAILURE_MESSAGE = function(status, message) {
          return "\u2716 Error " + status + " while fetching file: " + message;
        };
        var FAILURE_EMPTY_MESSAGE = "\u2716 Error: File does not exist or is empty";
        var EXTENSIONS = {
          "js": "javascript",
          "py": "python",
          "rb": "ruby",
          "ps1": "powershell",
          "psm1": "powershell",
          "sh": "bash",
          "bat": "batch",
          "h": "c",
          "tex": "latex"
        };
        var STATUS_ATTR = "data-src-status";
        var STATUS_LOADING = "loading";
        var STATUS_LOADED = "loaded";
        var STATUS_FAILED = "failed";
        var SELECTOR = "pre[data-src]:not([" + STATUS_ATTR + '="' + STATUS_LOADED + '"]):not([' + STATUS_ATTR + '="' + STATUS_LOADING + '"])';
        function loadFile(src, success, error) {
          var xhr = new XMLHttpRequest();
          xhr.open("GET", src, true);
          xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
              if (xhr.status < 400 && xhr.responseText) {
                success(xhr.responseText);
              } else {
                if (xhr.status >= 400) {
                  error(FAILURE_MESSAGE(xhr.status, xhr.statusText));
                } else {
                  error(FAILURE_EMPTY_MESSAGE);
                }
              }
            }
          };
          xhr.send(null);
        }
        function parseRange(range) {
          var m = /^\s*(\d+)\s*(?:(,)\s*(?:(\d+)\s*)?)?$/.exec(range || "");
          if (m) {
            var start = Number(m[1]);
            var comma = m[2];
            var end = m[3];
            if (!comma) {
              return [start, start];
            }
            if (!end) {
              return [start, void 0];
            }
            return [start, Number(end)];
          }
          return void 0;
        }
        Prism3.hooks.add("before-highlightall", function(env) {
          env.selector += ", " + SELECTOR;
        });
        Prism3.hooks.add("before-sanity-check", function(env) {
          var pre = (
            /** @type {HTMLPreElement} */
            env.element
          );
          if (pre.matches(SELECTOR)) {
            env.code = "";
            pre.setAttribute(STATUS_ATTR, STATUS_LOADING);
            var code = pre.appendChild(document.createElement("CODE"));
            code.textContent = LOADING_MESSAGE;
            var src = pre.getAttribute("data-src");
            var language = env.language;
            if (language === "none") {
              var extension = (/\.(\w+)$/.exec(src) || [, "none"])[1];
              language = EXTENSIONS[extension] || extension;
            }
            Prism3.util.setLanguage(code, language);
            Prism3.util.setLanguage(pre, language);
            var autoloader = Prism3.plugins.autoloader;
            if (autoloader) {
              autoloader.loadLanguages(language);
            }
            loadFile(
              src,
              function(text) {
                pre.setAttribute(STATUS_ATTR, STATUS_LOADED);
                var range = parseRange(pre.getAttribute("data-range"));
                if (range) {
                  var lines = text.split(/\r\n?|\n/g);
                  var start = range[0];
                  var end = range[1] == null ? lines.length : range[1];
                  if (start < 0) {
                    start += lines.length;
                  }
                  start = Math.max(0, Math.min(start - 1, lines.length));
                  if (end < 0) {
                    end += lines.length;
                  }
                  end = Math.max(0, Math.min(end, lines.length));
                  text = lines.slice(start, end).join("\n");
                  if (!pre.hasAttribute("data-start")) {
                    pre.setAttribute("data-start", String(start + 1));
                  }
                }
                code.textContent = text;
                Prism3.highlightElement(code);
              },
              function(error) {
                pre.setAttribute(STATUS_ATTR, STATUS_FAILED);
                code.textContent = error;
              }
            );
          }
        });
        Prism3.plugins.fileHighlight = {
          /**
           * Executes the File Highlight plugin for all matching `pre` elements under the given container.
           *
           * Note: Elements which are already loaded or currently loading will not be touched by this method.
           *
           * @param {ParentNode} [container=document]
           */
          highlight: function highlight(container) {
            var elements = (container || document).querySelectorAll(SELECTOR);
            for (var i = 0, element; element = elements[i++]; ) {
              Prism3.highlightElement(element);
            }
          }
        };
        var logged = false;
        Prism3.fileHighlight = function() {
          if (!logged) {
            console.warn("Prism.fileHighlight is deprecated. Use `Prism.plugins.fileHighlight.highlight` instead.");
            logged = true;
          }
          Prism3.plugins.fileHighlight.highlight.apply(this, arguments);
        };
      })();
    }
  });

  // src/js/modules/internalModule.js
  var internalModule = () => {
    console.log("Hola internal Module");
  };
  var internalModule_default = internalModule;

  // src/js/modules/styleGuideContainer.js
  var styleGuideContainer = () => {
    document.querySelectorAll(".style-guide-container").forEach((root) => {
      if (root.dataset.styleGuideContainerReady === "true") return;
      const links = [...root.querySelectorAll(".style-guide-container__nav-link")];
      const fab = root.querySelector(".style-guide-container__fab");
      const panel = root.querySelector(".style-guide-container__panel");
      if (!links.length) return;
      const sections = links.map((link) => {
        var _a;
        const id = (_a = link.getAttribute("href")) == null ? void 0 : _a.slice(1);
        const section = id ? document.getElementById(id) : null;
        return section ? { link, section } : null;
      }).filter(Boolean);
      const setActive = (activeHref) => {
        links.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === activeHref);
        });
      };
      const closeNav = () => {
        root.classList.remove("is-nav-open");
        if (panel) panel.hidden = true;
        if (fab) {
          fab.setAttribute("aria-expanded", "false");
          fab.setAttribute("aria-label", "Abrir navegacion del style guide");
        }
      };
      const openNav = () => {
        root.classList.add("is-nav-open");
        if (panel) panel.hidden = false;
        if (fab) {
          fab.setAttribute("aria-expanded", "true");
          fab.setAttribute("aria-label", "Cerrar navegacion del style guide");
        }
      };
      const toggleNav = () => {
        if (root.classList.contains("is-nav-open")) closeNav();
        else openNav();
      };
      if (fab) {
        fab.addEventListener("click", toggleNav);
      }
      links.forEach((link) => {
        link.addEventListener("click", () => {
          setActive(link.getAttribute("href"));
          closeNav();
        });
      });
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeNav();
      });
      if (sections.length && "IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
          (entries) => {
            const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
            if (!visible) return;
            const match = sections.find(({ section }) => section === visible.target);
            if (match) setActive(match.link.getAttribute("href"));
          },
          {
            rootMargin: "-20% 0px -55% 0px",
            threshold: [0.1, 0.25, 0.5]
          }
        );
        const uniqueSections = [
          ...new Map(sections.map(({ section }) => [section.id, section])).values()
        ];
        uniqueSections.forEach((section) => observer.observe(section));
      }
      const hash = window.location.hash;
      const initialHref = links.some((link) => link.getAttribute("href") === hash) ? hash : links[0].getAttribute("href");
      setActive(initialHref);
      root.dataset.styleGuideContainerReady = "true";
    });
  };
  var styleGuideContainer_default = styleGuideContainer;

  // src/js/db/crudDemoStore.js
  var LEGACY_PERSONA_KEY = "persona-grid-store-v2";
  var createId = (prefix = "id") => {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  };
  var readStore = (storageKey) => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed == null ? void 0 : parsed.personas) && !Array.isArray(parsed == null ? void 0 : parsed.tutores)) {
        return null;
      }
      return {
        personas: Array.isArray(parsed.personas) ? parsed.personas : [],
        tutores: Array.isArray(parsed.tutores) ? parsed.tutores : []
      };
    } catch (e) {
      return null;
    }
  };
  var writeStore = (storageKey, store) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(store));
      return true;
    } catch (e) {
      return false;
    }
  };
  var ensureIds = (list, prefix) => list.map(
    (item) => (item == null ? void 0 : item.id) ? item : {
      ...item,
      id: createId(prefix)
    }
  );
  var readLegacyPersonaStore = (legacyKey) => {
    try {
      const raw = localStorage.getItem(legacyKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed == null ? void 0 : parsed.personas) ? parsed.personas : null;
    } catch (e) {
      return null;
    }
  };
  var dispatchStoreUpdate = () => {
    document.dispatchEvent(new CustomEvent("crud-demo-store-updated"));
  };
  var persistStore = (storageKey, store) => {
    if (!writeStore(storageKey, store)) return false;
    dispatchStoreUpdate();
    return true;
  };
  var loadCrudStore = async ({
    storageKey,
    personaUrl,
    tutorUrl
  }) => {
    const stored = readStore(storageKey);
    if (stored) {
      const store2 = {
        personas: ensureIds(stored.personas, "persona"),
        tutores: ensureIds(stored.tutores, "tutor")
      };
      writeStore(storageKey, store2);
      return { ...store2, source: "localStorage" };
    }
    const legacyPersonas = readLegacyPersonaStore(LEGACY_PERSONA_KEY);
    const [personaResponse, tutorResponse] = await Promise.all([
      fetch(personaUrl),
      fetch(tutorUrl)
    ]);
    if (!personaResponse.ok) {
      throw new Error(`GET ${personaUrl} failed`);
    }
    if (!tutorResponse.ok) {
      throw new Error(`GET ${tutorUrl} failed`);
    }
    const [personaData, tutorData] = await Promise.all([
      personaResponse.json(),
      tutorResponse.json()
    ]);
    const store = {
      personas: ensureIds(
        legacyPersonas || (Array.isArray(personaData.personas) ? personaData.personas : []),
        "persona"
      ),
      tutores: ensureIds(
        Array.isArray(tutorData.tutores) ? tutorData.tutores : [],
        "tutor"
      )
    };
    writeStore(storageKey, store);
    return {
      ...store,
      source: legacyPersonas ? "legacy-localStorage" : personaUrl
    };
  };
  var findTutorName = (tutores, tutorId) => {
    if (!tutorId) return "";
    const tutor = tutores.find((item) => item.id === tutorId);
    return (tutor == null ? void 0 : tutor.nombre) || "";
  };

  // src/js/modules/personaGrid.js
  var setStatus = (statusEl, message, type) => {
    if (!statusEl) return;
    statusEl.hidden = !message;
    statusEl.textContent = message || "";
    statusEl.classList.toggle("persona-grid__status--ok", type === "ok");
    statusEl.classList.toggle("persona-grid__status--error", type === "error");
  };
  var buildPersonaFromForm = (form) => {
    const formData = new FormData(form);
    const persona = {};
    for (const [key, value] of formData.entries()) {
      if (key === "id") continue;
      const input = form.elements.namedItem(key);
      if (input && input.type === "number" && value !== "") {
        persona[key] = Number(value);
        continue;
      }
      persona[key] = value;
    }
    return persona;
  };
  var fillForm = (form, persona = {}) => {
    [...form.querySelectorAll(".persona-grid__input, .persona-grid__select, .persona-grid__id")].forEach(
      (input) => {
        const value = persona[input.name];
        input.value = value == null ? "" : String(value);
        input.classList.remove("persona-grid__input--invalid");
      }
    );
  };
  var populateTutorSelect = (root, tutores, selectedId = "") => {
    const select = root.querySelector('.persona-grid__select[name="tutorId"]');
    if (!select) return;
    const emptyOption = root.dataset.tutorEmptyOption || "Sin tutor";
    select.innerHTML = "";
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = emptyOption;
    select.append(placeholder);
    tutores.forEach((tutor) => {
      const option = document.createElement("option");
      option.value = tutor.id;
      option.textContent = tutor.nombre || tutor.id;
      if (tutor.id === selectedId) {
        option.selected = true;
      }
      select.append(option);
    });
  };
  var setFormMode = (root, mode) => {
    const formTitle = root.querySelector(".persona-grid__form-title");
    const submitBtn = root.querySelector(".persona-grid__submit");
    const cancelBtn = root.querySelector(".persona-grid__cancel");
    const isEdit = mode === "edit";
    if (formTitle) {
      formTitle.textContent = isEdit ? root.dataset.formTitleEdit || "Actualizar persona" : root.dataset.formTitleCreate || "Crear persona";
    }
    if (submitBtn) {
      submitBtn.textContent = isEdit ? root.dataset.submitUpdate || "Actualizar" : root.dataset.submitCreate || "Crear";
    }
    if (cancelBtn) {
      cancelBtn.hidden = !isEdit;
    }
  };
  var renderGrid = (root, store, labels) => {
    const grid = root.querySelector(".persona-grid__grid");
    const countEl = root.querySelector(".persona-grid__count");
    const preview = root.querySelector(".persona-grid__preview");
    const previewCode = root.querySelector(".persona-grid__preview-code code");
    const emptyMessage = root.dataset.emptyList || "Sin registros.";
    const tutorCardLabel = root.dataset.tutorCardLabel || "Tutor";
    const { countLabel, editLabel, deleteLabel, onEdit, onDelete } = labels;
    const { personas, tutores } = store;
    if (!grid) return;
    grid.innerHTML = "";
    if (!personas.length) {
      const empty = document.createElement("p");
      empty.className = "persona-grid__meta";
      empty.textContent = emptyMessage;
      grid.append(empty);
      if (countEl) countEl.hidden = true;
      if (preview) preview.hidden = true;
      return;
    }
    if (countEl) {
      countEl.hidden = false;
      countEl.textContent = `${personas.length} ${countLabel}`;
    }
    personas.forEach((persona) => {
      const card = document.createElement("article");
      card.className = "persona-grid__card";
      card.dataset.id = persona.id;
      const body = document.createElement("div");
      body.className = "persona-grid__card-body";
      const name = document.createElement("h4");
      name.className = "persona-grid__name";
      name.textContent = persona.nombre || "Sin nombre";
      const role = document.createElement("p");
      role.className = "persona-grid__role";
      role.textContent = persona.ocupacion || "";
      const meta = document.createElement("p");
      meta.className = "persona-grid__meta";
      meta.textContent = [
        persona.edad != null ? `${persona.edad} a\xF1os` : null,
        persona.estatura != null ? `${persona.estatura} m` : null,
        persona.ciudad,
        persona.telefono,
        persona.email
      ].filter(Boolean).join(" \xB7 ");
      body.append(name, role);
      const tutorName = findTutorName(tutores, persona.tutorId);
      if (tutorName) {
        const tutor = document.createElement("p");
        tutor.className = "persona-grid__tutor";
        tutor.textContent = `${tutorCardLabel}: ${tutorName}`;
        body.append(tutor);
      }
      body.append(meta);
      const actions = document.createElement("div");
      actions.className = "persona-grid__card-actions";
      const editBtn = document.createElement("button");
      editBtn.type = "button";
      editBtn.className = "btn btn--outline btn--small persona-grid__edit";
      editBtn.textContent = editLabel;
      editBtn.addEventListener("click", () => onEdit(persona.id));
      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "btn btn--secondary btn--small persona-grid__delete";
      deleteBtn.textContent = deleteLabel;
      deleteBtn.addEventListener("click", () => onDelete(persona.id));
      actions.append(editBtn, deleteBtn);
      card.append(body, actions);
      grid.append(card);
    });
    if (preview && previewCode) {
      preview.hidden = false;
      previewCode.textContent = JSON.stringify(
        { personas, tutores },
        null,
        "	"
      );
      if (typeof Prism !== "undefined") {
        Prism.highlightElement(previewCode);
      }
    }
  };
  var personaGrid = () => {
    document.querySelectorAll(".persona-grid").forEach((root) => {
      if (root.dataset.personaGridReady === "true") return;
      const form = root.querySelector(".persona-grid__form");
      const statusEl = root.querySelector(".persona-grid__status");
      const cancelBtn = root.querySelector(".persona-grid__cancel");
      const personaUrl = root.dataset.url || "./data/db/persona.json";
      const tutorUrl = root.dataset.tutorUrl || "./data/db/tutor.json";
      const storageKey = root.dataset.storageKey || "crud-demo-store-v3";
      const errorMessage = root.dataset.errorMessage || "No se pudo cargar el JSON est\xE1tico.";
      const loadingMessage = root.dataset.loadingMessage || "Cargando\u2026";
      const createdMessage = root.dataset.createdMessage || "Persona creada.";
      const updatedMessage = root.dataset.updatedMessage || "Persona actualizada.";
      const deletedMessage = root.dataset.deletedMessage || "Persona eliminada.";
      const countLabel = root.dataset.countLabel || "registros";
      const editLabel = root.dataset.editLabel || "Editar";
      const deleteLabel = root.dataset.deleteLabel || "Eliminar";
      const deleteConfirm = root.dataset.deleteConfirm || "\xBFEliminar esta persona?";
      let store = { personas: [], tutores: [] };
      let editingId = null;
      const persist = () => persistStore(storageKey, store);
      const paint = (message, type = "ok") => {
        renderGrid(root, store, {
          countLabel,
          editLabel,
          deleteLabel,
          onEdit: startEdit,
          onDelete: removePersona
        });
        setStatus(statusEl, message, type);
      };
      const syncFromStorage = () => {
        var _a;
        const latest = readStore(storageKey);
        if (!latest) return;
        store = latest;
        const currentPersona = editingId ? store.personas.find((item) => item.id === editingId) : null;
        populateTutorSelect(
          root,
          store.tutores,
          (currentPersona == null ? void 0 : currentPersona.tutorId) || ((_a = form == null ? void 0 : form.elements.namedItem("tutorId")) == null ? void 0 : _a.value) || ""
        );
        paint(null, null);
      };
      const resetCreateMode = () => {
        editingId = null;
        if (form) {
          form.reset();
          const idInput = form.querySelector(".persona-grid__id");
          if (idInput) idInput.value = "";
          [...form.querySelectorAll(".persona-grid__input, .persona-grid__select")].forEach(
            (input) => {
              input.classList.remove("persona-grid__input--invalid");
            }
          );
        }
        populateTutorSelect(root, store.tutores);
        setFormMode(root, "create");
      };
      const startEdit = (id) => {
        const persona = store.personas.find((item) => item.id === id);
        if (!persona || !form) return;
        editingId = id;
        populateTutorSelect(root, store.tutores, persona.tutorId || "");
        fillForm(form, persona);
        setFormMode(root, "edit");
        setStatus(statusEl, `Editando: ${persona.nombre || id}`, null);
        form.scrollIntoView({ behavior: "smooth", block: "nearest" });
        const first = form.querySelector(".persona-grid__input");
        if (first) first.focus();
      };
      const removePersona = (id) => {
        const persona = store.personas.find((item) => item.id === id);
        if (!persona) return;
        if (!window.confirm(`${deleteConfirm}
${persona.nombre || id}`)) return;
        store = {
          ...store,
          personas: store.personas.filter((item) => item.id !== id)
        };
        if (!persist()) return;
        if (editingId === id) {
          resetCreateMode();
        }
        paint(deletedMessage, "ok");
      };
      setStatus(statusEl, loadingMessage, null);
      setFormMode(root, "create");
      loadCrudStore({
        storageKey,
        personaUrl,
        tutorUrl
      }).then((loaded) => {
        store = loaded;
        populateTutorSelect(root, store.tutores);
        paint(
          loaded.source === "localStorage" ? `Cargado desde localStorage (${store.personas.length} ${countLabel})` : `Seed desde ${loaded.source} (${store.personas.length} ${countLabel})`,
          store.personas.length ? "ok" : null
        );
      }).catch(() => {
        store = { personas: [], tutores: [] };
        paint(errorMessage, "error");
      });
      document.addEventListener("crud-demo-store-updated", syncFromStorage);
      if (cancelBtn) {
        cancelBtn.addEventListener("click", () => {
          resetCreateMode();
          setStatus(statusEl, "Edicion cancelada.", null);
        });
      }
      if (form) {
        form.addEventListener("submit", (event) => {
          event.preventDefault();
          const inputs = [
            ...form.querySelectorAll(".persona-grid__input"),
            ...form.querySelectorAll(".persona-grid__select")
          ];
          let isValid = true;
          inputs.forEach((input) => {
            if (input.type === "select-one" && !input.required) return;
            const ok = input.checkValidity();
            input.classList.toggle("persona-grid__input--invalid", !ok);
            if (!ok) isValid = false;
          });
          if (!isValid) {
            form.reportValidity();
            return;
          }
          const payload = buildPersonaFromForm(form);
          if (!payload.tutorId) {
            delete payload.tutorId;
          }
          if (editingId) {
            store = {
              ...store,
              personas: store.personas.map(
                (item) => item.id === editingId ? { ...payload, id: editingId } : item
              )
            };
            if (!persist()) return;
            resetCreateMode();
            paint(updatedMessage, "ok");
            return;
          }
          store = {
            ...store,
            personas: [
              ...store.personas,
              { ...payload, id: createId("persona") }
            ]
          };
          if (!persist()) return;
          resetCreateMode();
          paint(createdMessage, "ok");
        });
      }
      root.dataset.personaGridReady = "true";
    });
  };
  var personaGrid_default = personaGrid;

  // src/js/modules/tutorGrid.js
  var setStatus2 = (statusEl, message, type) => {
    if (!statusEl) return;
    statusEl.hidden = !message;
    statusEl.textContent = message || "";
    statusEl.classList.toggle("tutor-grid__status--ok", type === "ok");
    statusEl.classList.toggle("tutor-grid__status--error", type === "error");
  };
  var buildTutorFromForm = (form) => {
    const formData = new FormData(form);
    const tutor = {};
    for (const [key, value] of formData.entries()) {
      if (key === "id") continue;
      tutor[key] = value;
    }
    return tutor;
  };
  var fillForm2 = (form, tutor = {}) => {
    [...form.querySelectorAll(".tutor-grid__input, .tutor-grid__id")].forEach((input) => {
      const value = tutor[input.name];
      input.value = value == null ? "" : String(value);
      input.classList.remove("tutor-grid__input--invalid");
    });
  };
  var setFormMode2 = (root, mode) => {
    const formTitle = root.querySelector(".tutor-grid__form-title");
    const submitBtn = root.querySelector(".tutor-grid__submit");
    const cancelBtn = root.querySelector(".tutor-grid__cancel");
    const isEdit = mode === "edit";
    if (formTitle) {
      formTitle.textContent = isEdit ? root.dataset.formTitleEdit || "Actualizar tutor" : root.dataset.formTitleCreate || "Crear tutor";
    }
    if (submitBtn) {
      submitBtn.textContent = isEdit ? root.dataset.submitUpdate || "Actualizar" : root.dataset.submitCreate || "Crear";
    }
    if (cancelBtn) {
      cancelBtn.hidden = !isEdit;
    }
  };
  var renderGrid2 = (root, tutores, labels) => {
    const grid = root.querySelector(".tutor-grid__grid");
    const countEl = root.querySelector(".tutor-grid__count");
    const preview = root.querySelector(".tutor-grid__preview");
    const previewCode = root.querySelector(".tutor-grid__preview-code code");
    const emptyMessage = root.dataset.emptyList || "Sin registros.";
    const { countLabel, editLabel, deleteLabel, onEdit, onDelete } = labels;
    if (!grid) return;
    grid.innerHTML = "";
    if (!tutores.length) {
      const empty = document.createElement("p");
      empty.className = "tutor-grid__meta";
      empty.textContent = emptyMessage;
      grid.append(empty);
      if (countEl) countEl.hidden = true;
      if (preview) preview.hidden = true;
      return;
    }
    if (countEl) {
      countEl.hidden = false;
      countEl.textContent = `${tutores.length} ${countLabel}`;
    }
    tutores.forEach((tutor) => {
      const card = document.createElement("article");
      card.className = "tutor-grid__card";
      card.dataset.id = tutor.id;
      const body = document.createElement("div");
      body.className = "tutor-grid__card-body";
      const name = document.createElement("h4");
      name.className = "tutor-grid__name";
      name.textContent = tutor.nombre || "Sin nombre";
      body.append(name);
      const actions = document.createElement("div");
      actions.className = "tutor-grid__card-actions";
      const editBtn = document.createElement("button");
      editBtn.type = "button";
      editBtn.className = "btn btn--outline btn--small tutor-grid__edit";
      editBtn.textContent = editLabel;
      editBtn.addEventListener("click", () => onEdit(tutor.id));
      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "btn btn--secondary btn--small tutor-grid__delete";
      deleteBtn.textContent = deleteLabel;
      deleteBtn.addEventListener("click", () => onDelete(tutor.id));
      actions.append(editBtn, deleteBtn);
      card.append(body, actions);
      grid.append(card);
    });
    if (preview && previewCode) {
      preview.hidden = false;
      previewCode.textContent = JSON.stringify({ tutores }, null, "	");
      if (typeof Prism !== "undefined") {
        Prism.highlightElement(previewCode);
      }
    }
  };
  var tutorGrid = () => {
    document.querySelectorAll(".tutor-grid").forEach((root) => {
      if (root.dataset.tutorGridReady === "true") return;
      const form = root.querySelector(".tutor-grid__form");
      const statusEl = root.querySelector(".tutor-grid__status");
      const cancelBtn = root.querySelector(".tutor-grid__cancel");
      const tutorUrl = root.dataset.url || "./data/db/tutor.json";
      const personaUrl = root.dataset.personaUrl || "./data/db/persona.json";
      const storageKey = root.dataset.storageKey || "crud-demo-store-v3";
      const errorMessage = root.dataset.errorMessage || "No se pudo cargar el JSON est\xE1tico.";
      const loadingMessage = root.dataset.loadingMessage || "Cargando\u2026";
      const createdMessage = root.dataset.createdMessage || "Tutor creado.";
      const updatedMessage = root.dataset.updatedMessage || "Tutor actualizado.";
      const deletedMessage = root.dataset.deletedMessage || "Tutor eliminado.";
      const deleteBlockedMessage = root.dataset.deleteBlockedMessage || "No se puede eliminar: hay personas con este tutor asignado.";
      const countLabel = root.dataset.countLabel || "registros";
      const editLabel = root.dataset.editLabel || "Editar";
      const deleteLabel = root.dataset.deleteLabel || "Eliminar";
      const deleteConfirm = root.dataset.deleteConfirm || "\xBFEliminar este tutor?";
      let store = { personas: [], tutores: [] };
      let editingId = null;
      const persist = () => persistStore(storageKey, store);
      const paint = (message, type = "ok") => {
        renderGrid2(root, store.tutores, {
          countLabel,
          editLabel,
          deleteLabel,
          onEdit: startEdit,
          onDelete: removeTutor
        });
        setStatus2(statusEl, message, type);
      };
      const syncFromStorage = () => {
        const latest = readStore(storageKey);
        if (!latest) return;
        store = latest;
        paint(null, null);
      };
      const resetCreateMode = () => {
        editingId = null;
        if (form) {
          form.reset();
          const idInput = form.querySelector(".tutor-grid__id");
          if (idInput) idInput.value = "";
          [...form.querySelectorAll(".tutor-grid__input")].forEach((input) => {
            input.classList.remove("tutor-grid__input--invalid");
          });
        }
        setFormMode2(root, "create");
      };
      const startEdit = (id) => {
        const tutor = store.tutores.find((item) => item.id === id);
        if (!tutor || !form) return;
        editingId = id;
        fillForm2(form, tutor);
        setFormMode2(root, "edit");
        setStatus2(statusEl, `Editando: ${tutor.nombre || id}`, null);
        form.scrollIntoView({ behavior: "smooth", block: "nearest" });
        const first = form.querySelector(".tutor-grid__input");
        if (first) first.focus();
      };
      const removeTutor = (id) => {
        const tutor = store.tutores.find((item) => item.id === id);
        if (!tutor) return;
        const assigned = store.personas.filter((persona) => persona.tutorId === id);
        if (assigned.length) {
          setStatus2(statusEl, deleteBlockedMessage, "error");
          return;
        }
        if (!window.confirm(`${deleteConfirm}
${tutor.nombre || id}`)) return;
        store = {
          ...store,
          tutores: store.tutores.filter((item) => item.id !== id)
        };
        if (!persist()) return;
        if (editingId === id) {
          resetCreateMode();
        }
        paint(deletedMessage, "ok");
      };
      setStatus2(statusEl, loadingMessage, null);
      setFormMode2(root, "create");
      loadCrudStore({
        storageKey,
        personaUrl,
        tutorUrl
      }).then((loaded) => {
        store = loaded;
        paint(
          loaded.source === "localStorage" ? `Cargado desde localStorage (${store.tutores.length} ${countLabel})` : `Seed desde ${loaded.source} (${store.tutores.length} ${countLabel})`,
          store.tutores.length ? "ok" : null
        );
      }).catch(() => {
        store = { personas: [], tutores: [] };
        paint(errorMessage, "error");
      });
      document.addEventListener("crud-demo-store-updated", syncFromStorage);
      if (cancelBtn) {
        cancelBtn.addEventListener("click", () => {
          resetCreateMode();
          setStatus2(statusEl, "Edicion cancelada.", null);
        });
      }
      if (form) {
        form.addEventListener("submit", (event) => {
          event.preventDefault();
          const inputs = [...form.querySelectorAll(".tutor-grid__input")];
          let isValid = true;
          inputs.forEach((input) => {
            const ok = input.checkValidity();
            input.classList.toggle("tutor-grid__input--invalid", !ok);
            if (!ok) isValid = false;
          });
          if (!isValid) {
            form.reportValidity();
            return;
          }
          const payload = buildTutorFromForm(form);
          if (editingId) {
            store = {
              ...store,
              tutores: store.tutores.map(
                (item) => item.id === editingId ? { ...payload, id: editingId } : item
              )
            };
            if (!persist()) return;
            resetCreateMode();
            paint(updatedMessage, "ok");
            return;
          }
          store = {
            ...store,
            tutores: [...store.tutores, { ...payload, id: createId("tutor") }]
          };
          if (!persist()) return;
          resetCreateMode();
          paint(createdMessage, "ok");
        });
      }
      root.dataset.tutorGridReady = "true";
    });
  };
  var tutorGrid_default = tutorGrid;

  // src/js/db/ecommerceStore.js
  var STORAGE_KEY = "choricar-ecommerce-store-v2";
  var STORE_EVENT = "ecommerce-store-updated";
  var CARS_URL = "./data/db/cars.json";
  var USERS_URL = "./data/db/users.json";
  var SUBSCRIPTIONS_URL = "./data/db/subscriptions.json";
  var createId2 = (prefix = "id") => {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
    }
    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
  };
  var emptyStore = () => ({
    cars: [],
    users: [],
    subscriptions: [],
    session: null
  });
  var readStore2 = (storageKey = STORAGE_KEY) => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed == null ? void 0 : parsed.cars) || !Array.isArray(parsed == null ? void 0 : parsed.users)) {
        return null;
      }
      return {
        cars: parsed.cars,
        users: parsed.users,
        subscriptions: Array.isArray(parsed.subscriptions) ? parsed.subscriptions : [],
        session: parsed.session || null
      };
    } catch (e) {
      return null;
    }
  };
  var writeStore2 = (storageKey, store) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(store));
      return true;
    } catch (e) {
      return false;
    }
  };
  var ensureIds2 = (list, prefix) => list.map(
    (item) => (item == null ? void 0 : item.id) ? item : {
      ...item,
      id: createId2(prefix)
    }
  );
  var dispatchStoreUpdate2 = () => {
    document.dispatchEvent(new CustomEvent(STORE_EVENT));
  };
  var memoryStore = null;
  var getStore = () => memoryStore || readStore2() || emptyStore();
  var persistStore2 = (store = getStore()) => {
    memoryStore = {
      cars: store.cars || [],
      users: store.users || [],
      subscriptions: store.subscriptions || [],
      session: store.session || null
    };
    if (!writeStore2(STORAGE_KEY, memoryStore)) return false;
    dispatchStoreUpdate2();
    return true;
  };
  var loadEcommerceStore = async ({
    carsUrl = CARS_URL,
    usersUrl = USERS_URL,
    subscriptionsUrl = SUBSCRIPTIONS_URL
  } = {}) => {
    const stored = readStore2();
    if (stored) {
      memoryStore = {
        cars: ensureIds2(stored.cars, "car"),
        users: ensureIds2(stored.users, "user"),
        subscriptions: ensureIds2(stored.subscriptions, "sub"),
        session: stored.session || null
      };
      writeStore2(STORAGE_KEY, memoryStore);
      return { ...memoryStore, source: "localStorage" };
    }
    const [carsRes, usersRes, subsRes] = await Promise.all([
      fetch(carsUrl),
      fetch(usersUrl),
      fetch(subscriptionsUrl).catch(() => null)
    ]);
    if (!carsRes.ok) throw new Error(`GET ${carsUrl} failed`);
    if (!usersRes.ok) throw new Error(`GET ${usersUrl} failed`);
    const [carsData, usersData] = await Promise.all([carsRes.json(), usersRes.json()]);
    let subscriptions = [];
    if (subsRes && subsRes.ok) {
      const subsData = await subsRes.json();
      subscriptions = Array.isArray(subsData.subscriptions) ? subsData.subscriptions : [];
    }
    memoryStore = {
      cars: ensureIds2(Array.isArray(carsData.cars) ? carsData.cars : [], "car"),
      users: ensureIds2(Array.isArray(usersData.users) ? usersData.users : [], "user"),
      subscriptions: ensureIds2(subscriptions, "sub"),
      session: null
    };
    writeStore2(STORAGE_KEY, memoryStore);
    return { ...memoryStore, source: carsUrl };
  };
  var getCars = () => getStore().cars.slice();
  var getCarById = (id) => getStore().cars.find((car) => car.id === id) || null;
  var addCar = (carData) => {
    const store = getStore();
    const user = getCurrentUser();
    if (!user) throw new Error("Debes iniciar sesi\xF3n para publicar");
    const userCars = store.cars.filter((c) => c.sellerId === user.id);
    if (user.plan !== "premium" && userCars.length >= 1) {
      throw new Error("LIMIT_FREE");
    }
    const car = {
      ...carData,
      id: carData.id || createId2("car"),
      sellerId: user.id,
      isPremium: user.plan === "premium",
      maintenance: Array.isArray(carData.maintenance) ? carData.maintenance : [],
      images: Array.isArray(carData.images) ? carData.images : [],
      createdAt: carData.createdAt || (/* @__PURE__ */ new Date()).toISOString()
    };
    store.cars = [car, ...store.cars];
    persistStore2(store);
    return car;
  };
  var updateCar = (id, data) => {
    const store = getStore();
    const index = store.cars.findIndex((car) => car.id === id);
    if (index < 0) throw new Error("Veh\xEDculo no encontrado");
    const user = getCurrentUser();
    if (!user || store.cars[index].sellerId !== user.id) {
      throw new Error("No tienes permiso para editar este veh\xEDculo");
    }
    store.cars[index] = {
      ...store.cars[index],
      ...data,
      id,
      sellerId: store.cars[index].sellerId
    };
    persistStore2(store);
    return store.cars[index];
  };
  var deleteCar = (id) => {
    const store = getStore();
    const car = store.cars.find((c) => c.id === id);
    if (!car) throw new Error("Veh\xEDculo no encontrado");
    const user = getCurrentUser();
    if (!user || car.sellerId !== user.id) {
      throw new Error("No tienes permiso para eliminar este veh\xEDculo");
    }
    store.cars = store.cars.filter((c) => c.id !== id);
    store.users = store.users.map((u) => ({
      ...u,
      favorites: (u.favorites || []).filter((favId) => favId !== id)
    }));
    persistStore2(store);
    return true;
  };
  var registerUser = (userData) => {
    const store = getStore();
    const email = String(userData.email || "").trim().toLowerCase();
    if (!email || !userData.password) {
      throw new Error("Email y contrase\xF1a son obligatorios");
    }
    if (store.users.some((u) => u.email.toLowerCase() === email)) {
      throw new Error("Este correo ya est\xE1 registrado");
    }
    const user = {
      id: createId2("user"),
      name: userData.name || "Usuario",
      email,
      password: String(userData.password),
      avatar: userData.avatar || `https://i.pravatar.cc/150?u=${encodeURIComponent(email)}`,
      phone: userData.phone || "",
      plan: "free",
      favorites: [],
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    store.users = [...store.users, user];
    store.session = { userId: user.id };
    persistStore2(store);
    return { ...user, password: void 0 };
  };
  var loginUser = (email, password) => {
    const store = getStore();
    const normalized = String(email || "").trim().toLowerCase();
    const user = store.users.find(
      (u) => u.email.toLowerCase() === normalized && u.password === String(password)
    );
    if (!user) throw new Error("Correo o contrase\xF1a incorrectos");
    store.session = { userId: user.id };
    persistStore2(store);
    return { ...user, password: void 0 };
  };
  var loginWithSocial = (provider, profile = {}) => {
    const store = getStore();
    const email = profile.email || `${provider}-${Date.now()}@choricar.social`;
    let user = store.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      user = {
        id: createId2("user"),
        name: profile.name || `Usuario ${provider}`,
        email: email.toLowerCase(),
        password: createId2("social"),
        avatar: profile.avatar || `https://i.pravatar.cc/150?u=${encodeURIComponent(email)}`,
        phone: "",
        plan: "free",
        favorites: [],
        provider,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      store.users = [...store.users, user];
    }
    store.session = { userId: user.id, provider };
    persistStore2(store);
    return { ...user, password: void 0 };
  };
  var logout = () => {
    const store = getStore();
    store.session = null;
    persistStore2(store);
  };
  var getCurrentUser = () => {
    var _a;
    const store = getStore();
    if (!((_a = store.session) == null ? void 0 : _a.userId)) return null;
    const user = store.users.find((u) => u.id === store.session.userId);
    if (!user) return null;
    const { password, ...safe } = user;
    return safe;
  };
  var updateUser = (id, data) => {
    const store = getStore();
    const index = store.users.findIndex((u) => u.id === id);
    if (index < 0) throw new Error("Usuario no encontrado");
    const current = getCurrentUser();
    if (!current || current.id !== id) {
      throw new Error("No tienes permiso para editar este perfil");
    }
    const next = { ...store.users[index], ...data, id };
    if (data.password === "" || data.password == null) {
      next.password = store.users[index].password;
    }
    store.users[index] = next;
    persistStore2(store);
    const { password, ...safe } = next;
    return safe;
  };
  var toggleFavorite = (userId, carId) => {
    const store = getStore();
    const index = store.users.findIndex((u) => u.id === userId);
    if (index < 0) throw new Error("Usuario no encontrado");
    const favorites = Array.isArray(store.users[index].favorites) ? [...store.users[index].favorites] : [];
    const favIndex = favorites.indexOf(carId);
    if (favIndex >= 0) {
      favorites.splice(favIndex, 1);
    } else {
      favorites.push(carId);
    }
    store.users[index] = { ...store.users[index], favorites };
    persistStore2(store);
    return favorites;
  };
  var subscribe = (userId, plan = "premium") => {
    const store = getStore();
    const index = store.users.findIndex((u) => u.id === userId);
    if (index < 0) throw new Error("Usuario no encontrado");
    store.users[index] = { ...store.users[index], plan };
    store.cars = store.cars.map(
      (car) => car.sellerId === userId ? { ...car, isPremium: plan === "premium" } : car
    );
    const start = /* @__PURE__ */ new Date();
    const end = new Date(start);
    end.setFullYear(end.getFullYear() + 1);
    store.subscriptions = [
      {
        id: createId2("sub"),
        userId,
        plan,
        startDate: start.toISOString().slice(0, 10),
        endDate: end.toISOString().slice(0, 10)
      },
      ...store.subscriptions.filter((s) => s.userId !== userId)
    ];
    persistStore2(store);
    return getCurrentUser();
  };
  var getUserById = (id) => {
    const user = getStore().users.find((u) => u.id === id);
    if (!user) return null;
    const { password, ...safe } = user;
    return safe;
  };
  var formatPrice = (price, currency = "CRC") => {
    const value = Number(price) || 0;
    if (currency === "USD") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0
      }).format(value);
    }
    return new Intl.NumberFormat("es-CR", {
      style: "currency",
      currency: "CRC",
      maximumFractionDigits: 0
    }).format(value);
  };
  var formatMileage = (km) => `${new Intl.NumberFormat("es-CR").format(Number(km) || 0)} km`;
  var conditionLabel = (condition) => condition === "new" ? "Nuevo" : "Usado";
  var transmissionLabel = (value) => value === "automatic" ? "Autom\xE1tica" : "Manual";
  var fuelLabel = (value) => {
    const map = {
      gasoline: "Gasolina",
      diesel: "Di\xE9sel",
      electric: "El\xE9ctrico",
      hybrid: "H\xEDbrido"
    };
    return map[value] || value;
  };

  // src/js/modules/mainHeader.js
  var closeUserMenus = (except = null) => {
    document.querySelectorAll("[data-user-menu].is-open").forEach((menu) => {
      if (except && menu === except) return;
      menu.classList.remove("is-open");
      const trigger = menu.querySelector("[data-user-menu-trigger]");
      const panel = menu.querySelector("[data-user-menu-panel]");
      trigger == null ? void 0 : trigger.setAttribute("aria-expanded", "false");
      if (panel) panel.hidden = true;
    });
  };
  var setMobileNavOpen = (root, open) => {
    const toggle = root.querySelector("[data-nav-toggle]");
    const nav = root.querySelector("[data-nav-panel]");
    const backdrop = root.querySelector("[data-nav-backdrop]");
    toggle == null ? void 0 : toggle.setAttribute("aria-expanded", String(open));
    toggle == null ? void 0 : toggle.setAttribute("aria-label", open ? "Cerrar men\xFA" : "Abrir men\xFA");
    nav == null ? void 0 : nav.classList.toggle("is-open", open);
    backdrop == null ? void 0 : backdrop.classList.toggle("is-open", open);
    if (backdrop) backdrop.hidden = !open;
    document.body.classList.toggle("has-mobile-nav", open);
  };
  var renderAuthSlot = (root) => {
    var _a;
    const slot = root.querySelector("[data-auth-slot]");
    if (!slot) return;
    const user = getCurrentUser();
    if (!user) {
      slot.innerHTML = `
			<a class="main-header__btn main-header__btn--ghost" href="./login.html">Iniciar sesi\xF3n</a>
			<a class="main-header__btn main-header__btn--accent" href="./registro.html">Registrarse</a>
		`;
      return;
    }
    slot.innerHTML = `
		<div class="main-header__user-menu" data-user-menu>
			<button
				class="main-header__avatar-btn"
				type="button"
				data-user-menu-trigger
				aria-expanded="false"
				aria-haspopup="true"
				aria-controls="main-header-user-panel"
				aria-label="Men\xFA de cuenta"
			>
				<img class="main-header__avatar" src="${user.avatar}" alt="" width="32" height="32" />
			</button>
			<div class="main-header__user-tip" id="main-header-user-panel" role="menu" hidden data-user-menu-panel>
				<button class="main-header__user-tip-btn" type="button" role="menuitem" data-logout>Cerrar sesi\xF3n</button>
			</div>
		</div>
	`;
    const menu = slot.querySelector("[data-user-menu]");
    const trigger = slot.querySelector("[data-user-menu-trigger]");
    const panel = slot.querySelector("[data-user-menu-panel]");
    const setOpen = (open) => {
      menu == null ? void 0 : menu.classList.toggle("is-open", open);
      trigger == null ? void 0 : trigger.setAttribute("aria-expanded", String(open));
      if (panel) panel.hidden = !open;
    };
    trigger == null ? void 0 : trigger.addEventListener("click", (event) => {
      event.stopPropagation();
      const willOpen = trigger.getAttribute("aria-expanded") !== "true";
      closeUserMenus(menu);
      setOpen(willOpen);
    });
    panel == null ? void 0 : panel.addEventListener("click", (event) => {
      event.stopPropagation();
    });
    (_a = slot.querySelector("[data-logout]")) == null ? void 0 : _a.addEventListener("click", () => {
      logout();
      window.location.href = "./index.html";
    });
  };
  var mainHeader = () => {
    document.querySelectorAll(".main-header").forEach((root) => {
      if (root.dataset.mainHeaderReady === "true") {
        renderAuthSlot(root);
        return;
      }
      const toggle = root.querySelector("[data-nav-toggle]");
      const backdrop = root.querySelector("[data-nav-backdrop]");
      const nav = root.querySelector("[data-nav-panel]");
      const openNav = () => setMobileNavOpen(root, true);
      const closeNav = () => setMobileNavOpen(root, false);
      toggle == null ? void 0 : toggle.addEventListener("click", () => {
        const open = toggle.getAttribute("aria-expanded") === "true";
        if (open) closeNav();
        else openNav();
      });
      backdrop == null ? void 0 : backdrop.addEventListener("click", closeNav);
      nav == null ? void 0 : nav.querySelectorAll(".main-header__link").forEach((link) => {
        link.addEventListener("click", closeNav);
      });
      document.addEventListener("click", () => closeUserMenus());
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          closeUserMenus();
          closeNav();
        }
      });
      window.addEventListener("resize", () => {
        if (window.matchMedia(`(min-width: 960px)`).matches) {
          closeNav();
        }
      });
      renderAuthSlot(root);
      document.addEventListener(STORE_EVENT, () => renderAuthSlot(root));
      root.dataset.mainHeaderReady = "true";
    });
  };
  var ensureStore = async () => {
    try {
      await loadEcommerceStore();
    } catch (error) {
      console.error(error);
    }
  };
  var mainHeader_default = mainHeader;

  // src/js/modules/heroSlider.js
  var heroSlider = () => {
    if (typeof Swiper === "undefined") return;
    document.querySelectorAll(".hero-banner").forEach((root) => {
      if (root.dataset.heroSliderReady === "true") return;
      const el = root.querySelector(".hero-banner__slider");
      if (!el) return;
      new Swiper(el, {
        slidesPerView: 1,
        loop: true,
        autoplay: { delay: 5500, disableOnInteraction: false },
        pagination: {
          el: root.querySelector(".hero-banner__pagination"),
          clickable: true
        }
      });
      const modelsDataEl = document.getElementById("filters-models-data");
      let modelsByBrand = {};
      try {
        modelsByBrand = modelsDataEl ? JSON.parse(modelsDataEl.textContent) : {};
      } catch (e) {
        modelsByBrand = {};
      }
      const brandSelect = root.querySelector("#hero-brand");
      const modelSelect = root.querySelector("#hero-model");
      const fillModels = (brand) => {
        if (!modelSelect) return;
        modelSelect.innerHTML = '<option value="">Todas</option>';
        (modelsByBrand[brand] || []).forEach((model) => {
          const option = document.createElement("option");
          option.value = model;
          option.textContent = model;
          modelSelect.append(option);
        });
      };
      brandSelect == null ? void 0 : brandSelect.addEventListener("change", () => fillModels(brandSelect.value));
      root.dataset.heroSliderReady = "true";
    });
  };
  var heroSlider_default = heroSlider;

  // src/js/modules/toast.js
  var toast = () => {
    document.querySelectorAll(".toast").forEach((root) => {
      if (root.dataset.toastReady === "true") return;
      const closeBtn = root.querySelector("[data-toast-close]");
      closeBtn == null ? void 0 : closeBtn.addEventListener("click", () => {
        root.hidden = true;
      });
      root.dataset.toastReady = "true";
    });
  };
  var showToast = (message, type = "success") => {
    let root = document.querySelector(".toast");
    if (!root) {
      root = document.createElement("div");
      root.className = "toast";
      root.innerHTML = '<p class="toast__message" data-toast-message></p><button class="toast__close" type="button" aria-label="Cerrar" data-toast-close>\xD7</button>';
      document.body.append(root);
      toast();
    }
    const messageEl = root.querySelector("[data-toast-message]");
    if (messageEl) messageEl.textContent = message;
    root.classList.toggle("toast--error", type === "error");
    root.classList.toggle("toast--success", type !== "error");
    root.hidden = false;
    window.clearTimeout(root._toastTimer);
    root._toastTimer = window.setTimeout(() => {
      root.hidden = true;
    }, 3200);
  };
  var toast_default = toast;

  // src/js/modules/vehicleCard.js
  var createVehicleCardElement = (car, { favorited = false } = {}) => {
    var _a;
    const article = document.createElement("article");
    article.className = "vehicle-card";
    article.dataset.vehicleId = car.id;
    const href = `./vehiculo.html?id=${encodeURIComponent(car.id)}`;
    const image = ((_a = car.images) == null ? void 0 : _a[0]) || "https://picsum.photos/seed/fallback/800/600";
    const title = `${car.brand} ${car.model}`;
    article.innerHTML = `
		<a class="vehicle-card__media" href="${href}">
			<img class="vehicle-card__image" src="${image}" alt="${title}" loading="lazy" />
			<span class="vehicle-card__badge vehicle-card__badge--condition">${conditionLabel(car.condition)}</span>
			${car.isPremium ? '<span class="vehicle-card__badge vehicle-card__badge--premium">Premium</span>' : ""}
		</a>
		<div class="vehicle-card__body">
			<div class="vehicle-card__top">
				<h3 class="vehicle-card__title">
					<a class="vehicle-card__title-link" href="${href}">${title}</a>
				</h3>
				<button class="vehicle-card__fav${favorited ? " is-active" : ""}" type="button" aria-label="Favorito" data-card-fav data-car-id="${car.id}" aria-pressed="${favorited}">
					<span aria-hidden="true">\u2665</span>
				</button>
			</div>
			<p class="vehicle-card__price">${formatPrice(car.price, car.currency)}</p>
			<ul class="vehicle-card__meta">
				<li class="vehicle-card__meta-item">${car.year}</li>
				<li class="vehicle-card__meta-item">${formatMileage(car.mileage)}</li>
				<li class="vehicle-card__meta-item">${car.location}</li>
			</ul>
		</div>
	`;
    return article;
  };
  var bindFavoriteButtons = (root) => {
    root.querySelectorAll("[data-card-fav]").forEach((btn) => {
      if (btn.dataset.favBound === "true") return;
      btn.dataset.favBound = "true";
      btn.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        const user = getCurrentUser();
        if (!user) {
          window.location.href = "./login.html";
          return;
        }
        const carId = btn.dataset.carId;
        try {
          const favorites = toggleFavorite(user.id, carId);
          const active = favorites.includes(carId);
          btn.classList.toggle("is-active", active);
          btn.setAttribute("aria-pressed", String(active));
          showToast(active ? "Agregado a favoritos" : "Eliminado de favoritos", "success");
        } catch (error) {
          showToast(error.message || "No se pudo actualizar favorito", "error");
        }
      });
    });
  };

  // src/js/modules/featuredVehicles.js
  var featuredVehicles = () => {
    document.querySelectorAll("[data-featured-root]").forEach((root) => {
      const render = () => {
        const grid = root.querySelector(".featured-vehicles__grid");
        if (!grid) return;
        const user = getCurrentUser();
        const favorites = (user == null ? void 0 : user.favorites) || [];
        const premium = getCars().filter((car) => car.isPremium).slice(0, 6);
        grid.innerHTML = "";
        premium.forEach((car) => {
          grid.append(
            createVehicleCardElement(car, {
              favorited: favorites.includes(car.id)
            })
          );
        });
        bindFavoriteButtons(grid);
      };
      if (root.dataset.featuredVehiclesReady === "true") {
        render();
        return;
      }
      render();
      document.addEventListener(STORE_EVENT, render);
      root.dataset.featuredVehiclesReady = "true";
    });
  };
  var featuredVehicles_default = featuredVehicles;

  // src/js/modules/vehicleGrid.js
  var PAGE_SIZE = 12;
  var readFiltersFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return {
      q: params.get("q") || "",
      brand: params.get("brand") || "",
      model: params.get("model") || "",
      yearMin: params.get("yearMin") || "",
      yearMax: params.get("yearMax") || "",
      priceMin: params.get("priceMin") || "",
      priceMax: params.get("priceMax") || "",
      condition: params.get("condition") || "",
      transmission: params.get("transmission") || "",
      fuel: params.get("fuel") || "",
      location: params.get("location") || "",
      sort: params.get("sort") || "price-asc",
      page: Number(params.get("page") || 1)
    };
  };
  var writeFiltersToUrl = (filters) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== "" && value != null && !(key === "page" && Number(value) === 1) && !(key === "sort" && value === "price-asc")) {
        params.set(key, String(value));
      }
    });
    const query = params.toString();
    const next = `${window.location.pathname}${query ? `?${query}` : ""}`;
    window.history.replaceState({}, "", next);
  };
  var normalize = (value) => String(value || "").trim().toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");
  var applyFilters = (cars, filters) => {
    let list = cars.slice();
    if (filters.q) {
      const q = normalize(filters.q);
      list = list.filter(
        (car) => normalize(`${car.brand} ${car.model} ${car.location} ${car.year}`).includes(q)
      );
    }
    if (filters.brand) {
      const brand = normalize(filters.brand);
      list = list.filter((c) => normalize(c.brand) === brand);
    }
    if (filters.model) {
      const model = normalize(filters.model);
      list = list.filter((c) => normalize(c.model) === model);
    }
    if (filters.yearMin) list = list.filter((c) => c.year >= Number(filters.yearMin));
    if (filters.yearMax) list = list.filter((c) => c.year <= Number(filters.yearMax));
    if (filters.priceMin) list = list.filter((c) => c.price >= Number(filters.priceMin));
    if (filters.priceMax) list = list.filter((c) => c.price <= Number(filters.priceMax));
    if (filters.condition) list = list.filter((c) => c.condition === filters.condition);
    if (filters.transmission) list = list.filter((c) => c.transmission === filters.transmission);
    if (filters.fuel) list = list.filter((c) => c.fuel === filters.fuel);
    if (filters.location) list = list.filter((c) => c.location === filters.location);
    switch (filters.sort) {
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "year-desc":
        list.sort((a, b) => b.year - a.year);
        break;
      case "year-asc":
        list.sort((a, b) => a.year - b.year);
        break;
      case "mileage-asc":
        list.sort((a, b) => a.mileage - b.mileage);
        break;
      default:
        list.sort((a, b) => a.price - b.price);
    }
    return list;
  };
  var buildOptionsFromCars = (cars, fallbackModelsByBrand = {}) => {
    const brands = /* @__PURE__ */ new Set();
    const years = /* @__PURE__ */ new Set();
    const modelsByBrand = {};
    cars.forEach((car) => {
      if (!(car == null ? void 0 : car.brand)) return;
      brands.add(car.brand);
      if (car.year != null) years.add(Number(car.year));
      if (!modelsByBrand[car.brand]) modelsByBrand[car.brand] = /* @__PURE__ */ new Set();
      if (car.model) modelsByBrand[car.brand].add(car.model);
    });
    Object.entries(fallbackModelsByBrand).forEach(([brand, models]) => {
      brands.add(brand);
      if (!modelsByBrand[brand]) modelsByBrand[brand] = /* @__PURE__ */ new Set();
      (models || []).forEach((model) => modelsByBrand[brand].add(model));
    });
    const normalizedModels = {};
    Object.keys(modelsByBrand).sort((a, b) => a.localeCompare(b, "es")).forEach((brand) => {
      normalizedModels[brand] = [...modelsByBrand[brand]].sort(
        (a, b) => a.localeCompare(b, "es")
      );
    });
    return {
      brands: [...brands].sort((a, b) => a.localeCompare(b, "es")),
      years: [...years].sort((a, b) => a - b),
      modelsByBrand: normalizedModels
    };
  };
  var fillSelect = (select, values, { allLabel = "Todas", selected = "" } = {}) => {
    if (!select) return;
    select.innerHTML = "";
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = allLabel;
    select.append(placeholder);
    values.forEach((value) => {
      const option = document.createElement("option");
      option.value = String(value);
      option.textContent = String(value);
      if (String(value) === String(selected)) option.selected = true;
      select.append(option);
    });
  };
  var vehicleGrid = () => {
    const filterRoot = document.querySelector("[data-filters-root]");
    const gridRoot = document.querySelector("[data-vehicle-grid]");
    if (!gridRoot) return;
    if (gridRoot.dataset.vehicleGridReady === "true") return;
    let fallbackModelsByBrand = {};
    const modelsDataEl = document.getElementById("filters-models-data-list") || document.getElementById("filters-models-data");
    try {
      fallbackModelsByBrand = modelsDataEl ? JSON.parse(modelsDataEl.textContent) : {};
    } catch (e) {
      fallbackModelsByBrand = {};
    }
    const form = filterRoot == null ? void 0 : filterRoot.querySelector(".vehicle-filters__form");
    const brandSelect = form == null ? void 0 : form.querySelector('[name="brand"]');
    const modelSelect = form == null ? void 0 : form.querySelector('[name="model"]');
    const yearMinSelect = form == null ? void 0 : form.querySelector('[name="yearMin"]');
    const yearMaxSelect = form == null ? void 0 : form.querySelector('[name="yearMax"]');
    const listEl = gridRoot.querySelector("[data-grid-list]");
    const countEl = gridRoot.querySelector("[data-grid-count]");
    const pageInfo = gridRoot.querySelector("[data-page-info]");
    const prevBtn = gridRoot.querySelector("[data-page-prev]");
    const nextBtn = gridRoot.querySelector("[data-page-next]");
    let modelsByBrand = { ...fallbackModelsByBrand };
    const syncFilterOptions = (filters = {}) => {
      const options = buildOptionsFromCars(getCars(), fallbackModelsByBrand);
      modelsByBrand = options.modelsByBrand;
      const currentBrand = filters.brand || (brandSelect == null ? void 0 : brandSelect.value) || "";
      const currentModel = filters.model || (modelSelect == null ? void 0 : modelSelect.value) || "";
      const currentYearMin = filters.yearMin || (yearMinSelect == null ? void 0 : yearMinSelect.value) || "";
      const currentYearMax = filters.yearMax || (yearMaxSelect == null ? void 0 : yearMaxSelect.value) || "";
      fillSelect(brandSelect, options.brands, {
        allLabel: "Todas",
        selected: currentBrand
      });
      fillSelect(modelSelect, modelsByBrand[currentBrand] || [], {
        allLabel: "Todas",
        selected: currentModel
      });
      fillSelect(yearMinSelect, options.years, {
        allLabel: "Todas",
        selected: currentYearMin
      });
      fillSelect(yearMaxSelect, options.years, {
        allLabel: "Todas",
        selected: currentYearMax
      });
    };
    const getFiltersFromForm = () => {
      const base = readFiltersFromUrl();
      if (!form) return base;
      const data = new FormData(form);
      return {
        ...base,
        brand: data.get("brand") || "",
        model: data.get("model") || "",
        yearMin: data.get("yearMin") || "",
        yearMax: data.get("yearMax") || "",
        priceMin: data.get("priceMin") || "",
        priceMax: data.get("priceMax") || "",
        condition: data.get("condition") || "",
        transmission: data.get("transmission") || "",
        fuel: data.get("fuel") || "",
        location: data.get("location") || "",
        sort: data.get("sort") || "price-asc",
        page: base.page || 1
      };
    };
    const render = (filters = getFiltersFromForm()) => {
      syncFilterOptions(filters);
      if (filters.brand && filters.model) {
        const allowed = modelsByBrand[filters.brand] || [];
        if (!allowed.includes(filters.model)) {
          filters = { ...filters, model: "" };
          if (modelSelect) modelSelect.value = "";
        }
      }
      const user = getCurrentUser();
      const favorites = (user == null ? void 0 : user.favorites) || [];
      const filtered = applyFilters(getCars(), filters);
      const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
      const page = Math.min(Math.max(1, Number(filters.page) || 1), totalPages);
      const start = (page - 1) * PAGE_SIZE;
      const pageItems = filtered.slice(start, start + PAGE_SIZE);
      if (countEl) {
        countEl.textContent = `${filtered.length} veh\xEDculo${filtered.length === 1 ? "" : "s"} encontrados`;
      }
      if (listEl) {
        listEl.innerHTML = "";
        if (!pageItems.length) {
          listEl.innerHTML = '<p class="vehicle-grid__empty">No hay resultados con esos filtros.</p>';
        } else {
          pageItems.forEach((car) => {
            listEl.append(
              createVehicleCardElement(car, {
                favorited: favorites.includes(car.id)
              })
            );
          });
          bindFavoriteButtons(listEl);
        }
      }
      if (pageInfo) pageInfo.textContent = `${page} / ${totalPages}`;
      if (prevBtn) prevBtn.disabled = page <= 1;
      if (nextBtn) nextBtn.disabled = page >= totalPages;
      const nextFilters = { ...filters, page };
      writeFiltersToUrl(nextFilters);
      gridRoot._filters = nextFilters;
    };
    const initial = readFiltersFromUrl();
    render(initial);
    brandSelect == null ? void 0 : brandSelect.addEventListener("change", () => {
      const filters = { ...getFiltersFromForm(), model: "", page: 1 };
      render(filters);
    });
    form == null ? void 0 : form.addEventListener("change", (event) => {
      if (event.target === brandSelect) return;
      const filters = { ...getFiltersFromForm(), page: 1 };
      render(filters);
    });
    form == null ? void 0 : form.addEventListener("reset", () => {
      window.setTimeout(() => {
        render({
          q: "",
          brand: "",
          model: "",
          yearMin: "",
          yearMax: "",
          priceMin: "",
          priceMax: "",
          condition: "",
          transmission: "",
          fuel: "",
          location: "",
          sort: "price-asc",
          page: 1
        });
      }, 0);
    });
    prevBtn == null ? void 0 : prevBtn.addEventListener("click", () => {
      const filters = { ...gridRoot._filters || getFiltersFromForm() };
      filters.page = Math.max(1, (filters.page || 1) - 1);
      render(filters);
    });
    nextBtn == null ? void 0 : nextBtn.addEventListener("click", () => {
      const filters = { ...gridRoot._filters || getFiltersFromForm() };
      filters.page = (filters.page || 1) + 1;
      render(filters);
    });
    document.addEventListener(
      STORE_EVENT,
      () => render(gridRoot._filters || getFiltersFromForm())
    );
    gridRoot.dataset.vehicleGridReady = "true";
  };
  var vehicleGrid_default = vehicleGrid;

  // src/js/modules/vehicleFilters.js
  var vehicleFilters = () => {
    document.querySelectorAll("[data-filters-root]").forEach((root) => {
      if (root.dataset.vehicleFiltersReady === "true") return;
      const toggle = root.querySelector(".vehicle-filters__toggle");
      const form = root.querySelector(".vehicle-filters__form");
      toggle == null ? void 0 : toggle.addEventListener("click", () => {
        const open = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", String(!open));
        form == null ? void 0 : form.classList.toggle("is-open", !open);
      });
      root.dataset.vehicleFiltersReady = "true";
    });
  };
  var vehicleFilters_default = vehicleFilters;

  // src/js/modules/vehicleGallerySlider.js
  var vehicleGallerySlider = () => {
    if (typeof Swiper === "undefined") return;
    document.querySelectorAll(".vehicle-gallery-slider").forEach((root) => {
      if (root.dataset.vehicleGallerySliderReady === "true") return;
      const el = root.querySelector(".swiper");
      if (!el) return;
      root._swiper = new Swiper(el, {
        slidesPerView: 1,
        spaceBetween: 8,
        navigation: {
          nextEl: root.querySelector(".swiper-button-next"),
          prevEl: root.querySelector(".swiper-button-prev")
        },
        pagination: {
          el: root.querySelector(".swiper-pagination"),
          clickable: true
        }
      });
      root.dataset.vehicleGallerySliderReady = "true";
    });
  };
  var vehicleGallerySlider_default = vehicleGallerySlider;

  // src/js/modules/vehicleDetail.js
  var renderMaintenance = (root, maintenance = []) => {
    const empty = root.querySelector("[data-maintenance-empty]");
    const list = root.querySelector("[data-maintenance-items]");
    if (!list) return;
    list.innerHTML = "";
    if (!maintenance.length) {
      if (empty) empty.hidden = false;
      return;
    }
    if (empty) empty.hidden = true;
    maintenance.slice().sort((a, b) => String(b.date).localeCompare(String(a.date))).forEach((item) => {
      const li = document.createElement("li");
      li.className = "maintenance-list__item";
      li.innerHTML = `
				<div class="maintenance-list__head">
					<strong class="maintenance-list__type">${item.type}</strong>
					<span class="maintenance-list__date">${item.date}</span>
				</div>
				<p class="maintenance-list__desc">${item.description || ""}</p>
				<p class="maintenance-list__cost">${formatPrice(item.cost, "CRC")}</p>
			`;
      list.append(li);
    });
  };
  var vehicleDetail = () => {
    document.querySelectorAll("[data-vehicle-detail]").forEach((root) => {
      var _a;
      if (root.dataset.vehicleDetailReady === "true") return;
      const params = new URLSearchParams(window.location.search);
      const id = params.get("id");
      const loading = root.querySelector("[data-detail-loading]");
      const empty = root.querySelector("[data-detail-empty]");
      const content = root.querySelector("[data-detail-content]");
      const render = () => {
        var _a2;
        const car = id ? getCarById(id) : null;
        if (loading) loading.hidden = true;
        if (!car) {
          if (empty) empty.hidden = false;
          if (content) content.hidden = true;
          return;
        }
        if (empty) empty.hidden = true;
        if (content) content.hidden = false;
        const setText = (selector, value) => {
          const el = root.querySelector(selector);
          if (el) el.textContent = value;
        };
        setText("[data-detail-title]", `${car.brand} ${car.model}`);
        setText("[data-detail-price]", formatPrice(car.price, car.currency));
        setText("[data-detail-condition]", conditionLabel(car.condition));
        setText("[data-detail-year]", String(car.year));
        setText("[data-detail-mileage]", formatMileage(car.mileage));
        setText("[data-detail-transmission]", transmissionLabel(car.transmission));
        setText("[data-detail-fuel]", fuelLabel(car.fuel));
        setText("[data-detail-location]", car.location);
        setText("[data-detail-description]", car.description || "");
        const premium = root.querySelector("[data-detail-premium]");
        if (premium) premium.hidden = !car.isPremium;
        const gallery = root.querySelector("[data-detail-gallery]");
        if (gallery) {
          gallery.innerHTML = "";
          (car.images || []).forEach((src) => {
            const slide = document.createElement("div");
            slide.className = "swiper-slide";
            slide.innerHTML = `<img class="vehicle-detail__image" src="${src}" alt="${car.brand} ${car.model}" />`;
            gallery.append(slide);
          });
          root.querySelector(".vehicle-gallery-slider").dataset.vehicleGallerySliderReady = "false";
          vehicleGallerySlider_default();
        }
        renderMaintenance(root, car.maintenance);
        const seller = getUserById(car.sellerId);
        const sellerEl = root.querySelector("[data-detail-seller]");
        if (sellerEl) {
          sellerEl.innerHTML = seller ? `
						<img class="vehicle-detail__seller-avatar" src="${seller.avatar}" alt="" width="64" height="64" />
						<div>
							<p class="vehicle-detail__seller-name">${seller.name}</p>
							<p class="vehicle-detail__seller-meta">${seller.phone || ""}</p>
							<p class="vehicle-detail__seller-meta">${seller.email || ""}</p>
							<p class="vehicle-detail__seller-plan">Plan: ${seller.plan === "premium" ? "Premium" : "Gratis"}</p>
						</div>
					` : "<p>Vendedor no disponible</p>";
        }
        const contact = root.querySelector("[data-detail-contact]");
        if (contact && (seller == null ? void 0 : seller.email)) {
          contact.href = `mailto:${seller.email}?subject=${encodeURIComponent(`Consulta: ${car.brand} ${car.model}`)}`;
        }
        const favBtn = root.querySelector("[data-detail-fav]");
        const user = getCurrentUser();
        const isFav = Boolean((_a2 = user == null ? void 0 : user.favorites) == null ? void 0 : _a2.includes(car.id));
        favBtn == null ? void 0 : favBtn.classList.toggle("is-active", isFav);
        favBtn == null ? void 0 : favBtn.setAttribute("aria-pressed", String(isFav));
      };
      root.querySelectorAll("[data-tab]").forEach((tab) => {
        tab.addEventListener("click", () => {
          const name = tab.dataset.tab;
          root.querySelectorAll("[data-tab]").forEach((t) => {
            const active = t === tab;
            t.classList.toggle("is-active", active);
            t.setAttribute("aria-selected", String(active));
          });
          root.querySelectorAll("[data-panel]").forEach((panel) => {
            const active = panel.dataset.panel === name;
            panel.classList.toggle("is-active", active);
            panel.hidden = !active;
          });
        });
      });
      (_a = root.querySelector("[data-detail-fav]")) == null ? void 0 : _a.addEventListener("click", () => {
        const user = getCurrentUser();
        if (!user) {
          window.location.href = "./login.html";
          return;
        }
        try {
          const favorites = toggleFavorite(user.id, id);
          const active = favorites.includes(id);
          const favBtn = root.querySelector("[data-detail-fav]");
          favBtn == null ? void 0 : favBtn.classList.toggle("is-active", active);
          showToast(active ? "Agregado a favoritos" : "Eliminado de favoritos", "success");
        } catch (error) {
          showToast(error.message || "Error", "error");
        }
      });
      render();
      document.addEventListener(STORE_EVENT, render);
      root.dataset.vehicleDetailReady = "true";
    });
  };
  var vehicleDetail_default = vehicleDetail;

  // src/js/modules/authForm.js
  var authForm = () => {
    document.querySelectorAll("[data-auth-form]").forEach((root) => {
      if (root.dataset.authFormReady === "true") return;
      const mode = root.dataset.authMode || "login";
      const form = root.querySelector(".auth-form__form");
      const errorEl = root.querySelector("[data-auth-error]");
      form == null ? void 0 : form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (errorEl) {
          errorEl.hidden = true;
          errorEl.textContent = "";
        }
        const data = new FormData(form);
        try {
          if (mode === "register") {
            registerUser({
              name: data.get("name"),
              email: data.get("email"),
              password: data.get("password"),
              phone: data.get("phone")
            });
            showToast("Cuenta creada correctamente", "success");
          } else {
            loginUser(data.get("email"), data.get("password"));
            showToast("Sesi\xF3n iniciada", "success");
          }
          window.setTimeout(() => {
            window.location.href = "./dashboard.html";
          }, 400);
        } catch (error) {
          if (errorEl) {
            errorEl.hidden = false;
            errorEl.textContent = error.message || "Error de autenticaci\xF3n";
          }
          showToast(error.message || "Error", "error");
        }
      });
      root.querySelectorAll("[data-social]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const provider = btn.dataset.social;
          try {
            loginWithSocial(provider, {
              name: provider === "google" ? "Cuenta Google" : "Cuenta Facebook",
              email: `${provider}.demo@choricar.social`,
              avatar: `https://i.pravatar.cc/150?u=${provider}`
            });
            showToast(`Sesi\xF3n con ${provider}`, "success");
            window.setTimeout(() => {
              window.location.href = "./dashboard.html";
            }, 400);
          } catch (error) {
            showToast(error.message || "Error social login", "error");
          }
        });
      });
      root.dataset.authFormReady = "true";
    });
  };
  var authForm_default = authForm;

  // src/js/modules/dashboard.js
  var renderUserVehicles = (root, user) => {
    const list = root.querySelector("[data-user-vehicles-list]");
    const empty = root.querySelector("[data-user-vehicles-empty]");
    if (!list) return;
    const cars = getCars().filter((car) => car.sellerId === user.id);
    list.innerHTML = "";
    if (!cars.length) {
      if (empty) empty.hidden = false;
      return;
    }
    if (empty) empty.hidden = true;
    cars.forEach((car) => {
      var _a;
      const row = document.createElement("article");
      row.className = "user-vehicles__item";
      row.innerHTML = `
			<img class="user-vehicles__thumb" src="${((_a = car.images) == null ? void 0 : _a[0]) || ""}" alt="" width="96" height="72" />
			<div class="user-vehicles__info">
				<h3 class="user-vehicles__name">${car.brand} ${car.model} ${car.year}</h3>
				<p class="user-vehicles__price">${formatPrice(car.price, car.currency)}</p>
			</div>
			<div class="user-vehicles__actions">
				<a class="user-vehicles__edit" href="./agregar-vehiculo.html?edit=${encodeURIComponent(car.id)}">Editar</a>
				<button class="user-vehicles__delete" type="button" data-delete-car="${car.id}">Eliminar</button>
			</div>
		`;
      list.append(row);
    });
    list.querySelectorAll("[data-delete-car]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (!window.confirm("\xBFEliminar este veh\xEDculo?")) return;
        try {
          deleteCar(btn.dataset.deleteCar);
          showToast("Veh\xEDculo eliminado", "success");
        } catch (error) {
          showToast(error.message || "No se pudo eliminar", "error");
        }
      });
    });
  };
  var renderFavorites = (root, user) => {
    const list = root.querySelector("[data-favorites-list]");
    const empty = root.querySelector("[data-favorites-empty]");
    if (!list) return;
    const cars = (user.favorites || []).map((id) => getCarById(id)).filter(Boolean);
    list.innerHTML = "";
    if (!cars.length) {
      if (empty) empty.hidden = false;
      return;
    }
    if (empty) empty.hidden = true;
    cars.forEach((car) => {
      list.append(createVehicleCardElement(car, { favorited: true }));
    });
    bindFavoriteButtons(list);
  };
  var renderProfile = (root, user) => {
    const form = root.querySelector(".dashboard-profile__form");
    if (!form) return;
    form.elements.namedItem("name").value = user.name || "";
    form.elements.namedItem("email").value = user.email || "";
    form.elements.namedItem("phone").value = user.phone || "";
  };
  var renderSubscription = (root, user) => {
    const planEl = root.querySelector("[data-dash-plan]");
    if (planEl) {
      planEl.textContent = user.plan === "premium" ? "Plan actual: Premium (veh\xEDculos ilimitados + destacados)" : "Plan actual: Gratis (1 veh\xEDculo activo)";
    }
  };
  var showPanel = (root, panelId) => {
    root.querySelectorAll("[data-dash-tab]").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.dashTab === panelId);
    });
    root.querySelectorAll("[data-panel]").forEach((panel) => {
      const active = panel.dataset.panel === panelId;
      panel.classList.toggle("is-active", active);
      panel.hidden = !active;
    });
  };
  var dashboard = () => {
    document.querySelectorAll("[data-dashboard]").forEach((root) => {
      var _a;
      if (root.dataset.dashboardReady === "true") return;
      const guest = root.querySelector("[data-dashboard-guest]");
      const content = root.querySelector("[data-dashboard-content]");
      const render = () => {
        const user = getCurrentUser();
        if (!user) {
          if (guest) guest.hidden = false;
          if (content) content.hidden = true;
          return;
        }
        if (guest) guest.hidden = true;
        if (content) content.hidden = false;
        renderUserVehicles(root, user);
        renderFavorites(root, user);
        renderProfile(root, user);
        renderSubscription(root, user);
      };
      root.querySelectorAll("[data-dash-tab]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const tab = btn.dataset.dashTab;
          if (tab === "logout") {
            logout();
            window.location.href = "./index.html";
            return;
          }
          showPanel(root, tab);
        });
      });
      (_a = root.querySelector(".dashboard-profile__form")) == null ? void 0 : _a.addEventListener("submit", (event) => {
        event.preventDefault();
        const user = getCurrentUser();
        if (!user) return;
        const data = new FormData(event.currentTarget);
        try {
          updateUser(user.id, {
            name: data.get("name"),
            email: data.get("email"),
            phone: data.get("phone")
          });
          showToast("Perfil actualizado", "success");
        } catch (error) {
          showToast(error.message || "Error al guardar", "error");
        }
      });
      render();
      document.addEventListener(STORE_EVENT, render);
      root.dataset.dashboardReady = "true";
    });
  };
  var dashboard_default = dashboard;

  // src/js/modules/vehicleForm.js
  var DEFAULT_IMAGE_COPY = {
    remove: "Quitar",
    empty: "A\xFAn no hay im\xE1genes adjuntas.",
    maxFiles: 5,
    maxSizeMb: 2
  };
  var readFileAsDataUrl = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("No se pudo leer la imagen"));
    reader.readAsDataURL(file);
  });
  var compressImage = (dataUrl, maxWidth = 1200, quality = 0.82) => new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      const scale = Math.min(1, maxWidth / image.width);
      const width = Math.round(image.width * scale);
      const height = Math.round(image.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(dataUrl);
        return;
      }
      ctx.drawImage(image, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    image.onerror = () => resolve(dataUrl);
    image.src = dataUrl;
  });
  var vehicleForm = () => {
    document.querySelectorAll("[data-vehicle-form]").forEach((root) => {
      if (root.dataset.vehicleFormReady === "true") return;
      const form = root.querySelector(".vehicle-form__form");
      const titleEl = root.querySelector("[data-form-title]");
      const submitEl = root.querySelector("[data-form-submit]");
      const errorEl = root.querySelector("[data-form-error]");
      const limitEl = root.querySelector("[data-form-limit]");
      const idInput = root.querySelector("[data-form-id]");
      const fileInput = root.querySelector("[data-image-input]");
      const previewsEl = root.querySelector("[data-image-previews]");
      const emptyEl = root.querySelector("[data-images-empty]");
      let copy = {
        editTitle: "Editar veh\xEDculo",
        submitUpdate: "Guardar cambios",
        submitCreate: "Publicar",
        images: DEFAULT_IMAGE_COPY
      };
      try {
        const copyEl = document.getElementById("vehicle-form-copy");
        if (copyEl) copy = { ...copy, ...JSON.parse(copyEl.textContent) };
      } catch (e) {
      }
      const imageCopy = { ...DEFAULT_IMAGE_COPY, ...copy.images || {} };
      const maxFiles = Number(imageCopy.maxFiles) || 5;
      const maxBytes = (Number(imageCopy.maxSizeMb) || 2) * 1024 * 1024;
      let images = [];
      const renderPreviews = () => {
        if (!previewsEl) return;
        previewsEl.innerHTML = "";
        if (emptyEl) emptyEl.hidden = images.length > 0;
        images.forEach((src, index) => {
          const item = document.createElement("li");
          item.className = "vehicle-form__preview";
          item.innerHTML = `
					<img class="vehicle-form__preview-image" src="${src}" alt="Vista previa ${index + 1}" />
					<button class="vehicle-form__preview-remove" type="button" data-remove-image="${index}">
						${imageCopy.remove}
					</button>
				`;
          previewsEl.append(item);
        });
        previewsEl.querySelectorAll("[data-remove-image]").forEach((btn) => {
          btn.addEventListener("click", () => {
            const index = Number(btn.dataset.removeImage);
            images = images.filter((_, i) => i !== index);
            renderPreviews();
          });
        });
      };
      const params = new URLSearchParams(window.location.search);
      const editId = params.get("edit");
      const user = getCurrentUser();
      if (!user) {
        window.location.href = "./login.html";
        return;
      }
      if (editId) {
        const car = getCarById(editId);
        if (!car || car.sellerId !== user.id) {
          showToast("No puedes editar este veh\xEDculo", "error");
          window.location.href = "./dashboard.html";
          return;
        }
        if (titleEl) titleEl.textContent = copy.editTitle;
        if (submitEl) submitEl.textContent = copy.submitUpdate;
        if (idInput) idInput.value = car.id;
        Object.entries(car).forEach(([key, value]) => {
          if (key === "images") return;
          const field = form == null ? void 0 : form.elements.namedItem(key);
          if (!field || !("value" in field)) return;
          field.value = value != null ? value : "";
        });
        images = Array.isArray(car.images) ? [...car.images] : [];
      } else {
        const userCars = getCars().filter((c) => c.sellerId === user.id);
        if (user.plan !== "premium" && userCars.length >= 1) {
          if (limitEl) limitEl.hidden = false;
          if (form) form.hidden = true;
        }
      }
      renderPreviews();
      fileInput == null ? void 0 : fileInput.addEventListener("change", async () => {
        const files = [...fileInput.files || []];
        fileInput.value = "";
        if (!files.length) return;
        const available = maxFiles - images.length;
        if (available <= 0) {
          showToast(`M\xE1ximo ${maxFiles} im\xE1genes`, "error");
          return;
        }
        const selected = files.slice(0, available);
        if (files.length > available) {
          showToast(`Solo se agregaron ${available} imagen(es)`, "error");
        }
        try {
          for (const file of selected) {
            if (!file.type.startsWith("image/")) {
              showToast(`Archivo no v\xE1lido: ${file.name}`, "error");
              continue;
            }
            if (file.size > maxBytes) {
              showToast(
                `${file.name} supera ${imageCopy.maxSizeMb} MB`,
                "error"
              );
              continue;
            }
            const raw = await readFileAsDataUrl(file);
            const compressed = await compressImage(raw);
            images.push(compressed);
          }
          renderPreviews();
        } catch (error) {
          showToast(error.message || "Error al adjuntar im\xE1genes", "error");
        }
      });
      form == null ? void 0 : form.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (errorEl) {
          errorEl.hidden = true;
          errorEl.textContent = "";
        }
        if (!images.length) {
          const message = "Adjunta al menos una imagen del veh\xEDculo";
          if (errorEl) {
            errorEl.hidden = false;
            errorEl.textContent = message;
          }
          showToast(message, "error");
          return;
        }
        const data = new FormData(form);
        const payload = {
          brand: data.get("brand"),
          model: data.get("model"),
          year: Number(data.get("year")),
          price: Number(data.get("price")),
          currency: data.get("currency") || "CRC",
          mileage: Number(data.get("mileage")),
          condition: data.get("condition"),
          transmission: data.get("transmission"),
          fuel: data.get("fuel"),
          location: data.get("location"),
          description: data.get("description"),
          images: [...images]
        };
        try {
          const id = data.get("id");
          if (id) {
            updateCar(String(id), payload);
            showToast("Veh\xEDculo actualizado", "success");
          } else {
            addCar(payload);
            showToast("Veh\xEDculo publicado", "success");
          }
          window.setTimeout(() => {
            window.location.href = "./dashboard.html";
          }, 500);
        } catch (error) {
          const message = error.message === "LIMIT_FREE" ? "L\xEDmite del plan Gratis alcanzado. Mejora a Premium." : error.message || "No se pudo guardar";
          if (errorEl) {
            errorEl.hidden = false;
            errorEl.textContent = message;
          }
          showToast(message, "error");
        }
      });
      root.dataset.vehicleFormReady = "true";
    });
  };
  var vehicleForm_default = vehicleForm;

  // src/js/modules/paymentModal.js
  var paymentModal = () => {
    document.querySelectorAll("[data-payment-modal]").forEach((root) => {
      if (root.dataset.paymentModalReady === "true") return;
      const form = root.querySelector(".payment-modal__form");
      const errorEl = root.querySelector("[data-modal-error]");
      const close = () => {
        root.hidden = true;
        document.body.classList.remove("has-modal");
      };
      const open = () => {
        root.hidden = false;
        document.body.classList.add("has-modal");
      };
      root.querySelectorAll("[data-modal-close]").forEach((el) => {
        el.addEventListener("click", close);
      });
      form == null ? void 0 : form.addEventListener("submit", (event) => {
        event.preventDefault();
        const user = getCurrentUser();
        if (!user) {
          window.location.href = "./login.html";
          return;
        }
        const data = new FormData(form);
        const number = String(data.get("cardNumber") || "").replace(/\s/g, "");
        if (number.length < 12) {
          if (errorEl) {
            errorEl.hidden = false;
            errorEl.textContent = "Ingresa un n\xFAmero de tarjeta v\xE1lido (simulado)";
          }
          return;
        }
        try {
          subscribe(user.id, "premium");
          showToast("\xA1Bienvenido a Premium!", "success");
          close();
          window.setTimeout(() => {
            window.location.href = "./dashboard.html";
          }, 600);
        } catch (error) {
          showToast(error.message || "No se pudo activar Premium", "error");
        }
      });
      root._openPaymentModal = open;
      root.dataset.paymentModalReady = "true";
    });
  };
  var openPaymentModal = () => {
    var _a, _b;
    const modal = document.querySelector("[data-payment-modal]");
    if (modal == null ? void 0 : modal._openPaymentModal) {
      modal._openPaymentModal();
      return;
    }
    paymentModal();
    (_b = (_a = document.querySelector("[data-payment-modal]")) == null ? void 0 : _a._openPaymentModal) == null ? void 0 : _b.call(_a);
  };
  var paymentModal_default = paymentModal;

  // src/js/modules/subscriptionPlans.js
  var subscriptionPlans = () => {
    document.querySelectorAll("[data-subscription-plans]").forEach((root) => {
      if (root.dataset.subscriptionPlansReady === "true") return;
      root.querySelectorAll("[data-plan-premium]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const user = getCurrentUser();
          if (!user) {
            window.location.href = "./login.html";
            return;
          }
          if (user.plan === "premium") {
            showToast("Ya tienes el plan Premium", "success");
            return;
          }
          openPaymentModal();
        });
      });
      root.dataset.subscriptionPlansReady = "true";
    });
  };
  var subscriptionPlans_default = subscriptionPlans;

  // src/js/index.js
  var import_prismjs = __toESM(require_prism(), 1);
  var initComponents = async () => {
    await ensureStore();
    internalModule_default();
    styleGuideContainer_default();
    tutorGrid_default();
    personaGrid_default();
    mainHeader_default();
    heroSlider_default();
    featuredVehicles_default();
    vehicleFilters_default();
    vehicleGrid_default();
    vehicleDetail_default();
    vehicleGallerySlider_default();
    authForm_default();
    dashboard_default();
    vehicleForm_default();
    paymentModal_default();
    subscriptionPlans_default();
    toast_default();
    import_prismjs.default.highlightAll();
  };
  document.addEventListener("DOMContentLoaded", initComponents);
})();
//# sourceMappingURL=index.js.map
