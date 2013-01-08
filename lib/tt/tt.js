/**
 * TUNA FRAMEWORK
 *
 * Copyright (c) 2012, Sergey Kononenko
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 * * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 * * Names of contributors may be used to endorse or promote products
 * derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL SERGEY KONONENKO BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */


/**
 * @namespace
 */
var tt = {};


/**
 * Версия библиотеки.
 *
 * @type {string}
 */
tt.VERSION = '0.1.0';


/**
 * @namespace
 */
tt.rules = {};


/**
 * @namespace
 */
tt.data = {};


/**
 * @namespace
 */
tt.view = {};


/**
 * @namespace
 */
tt.view.helpers = {};


/**
 * @param {!Node} target Целевой узел.
 * @param {!Object.<string, !Object>} sign Разметка шаблона.
 * @return {!tt.Template} Объект шаблона.
 */
tt.createTemplate = function(target, sign) {
  return tt.createTemplateFromRules(target, tt.createRules(sign));
};


/**
 * @param {!Node} target Целевой узел.
 * @param {!Array.<!tt.TemplateRule>} rules Правила трансформации шаблона.
 * @return {!tt.Template} Объект шаблона.
 */
tt.createTemplateFromRules = function(target, rules) {
  var units = [];

  var i = 0,
      l = rules.length;

  while (i < l) {
    units = units.concat(rules[i].createTemplateUnits(target));

    i += 1;
  }

  return new tt.Template(target, units);
};


/**
 * @param {!Object.<string, !Object>} sign Разметка шаблона.
 * @return {!Array.<!tt.TemplateRule>}  Правила трансформации шаблона.
 */
tt.createRules = function(sign) {
  var rules = [];

  for (var key in sign) {
    var atIndex = key.indexOf('@');
    var colonIndex = key.indexOf(':');

    if (atIndex !== -1 && colonIndex !== -1 && colonIndex > atIndex) {
      var type = key.substring(0, atIndex);
      var viewHelper = tt.view.createViewHelper(type, sign[key]);

      if (viewHelper !== null) {
        rules.push(new tt.TemplateRule(
            type, key.substring(atIndex + 1, colonIndex),
            key.substring(colonIndex + 1),
            viewHelper
            ));
      }
    }
  }

  return rules;
};
