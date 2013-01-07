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
 * @type {string}
 */
tt.view.TEXT = 'text';


/**
 * @type {string}
 */
tt.view.ATTR = 'attr';


/**
 * @type {string}
 */
tt.view.CASE = 'case';


/**
 * @type {string}
 */
tt.view.LIST = 'list';


/**
 *
 * @param {string} type Тип объекта управления отображением.
 * @param {!Object} options Данные настроек.
 * @return {tt.view.helpers.ITemplateViewHelper} Объект настроек.
 */
tt.view.createViewHelper = function(type, options) {
  switch (type) {
    case tt.view.TEXT:
      return tt.view.__createTextViewHelper(options);

    case tt.view.ATTR:
      return tt.view.__createAttributeViewHelper(options);

    case tt.view.CASE:
      return tt.view.__createCaseViewHelper(options);

    case tt.view.LIST:
      return tt.view.__createListViewHelper(options);
  }

  return null;
};


/**
 * @param {!Object} options Настрокий.
 * @return {tt.view.helpers.ITemplateViewHelper} Объект помощи отрисовке.
 */
tt.view.__createListViewHelper = function(options) {
  var itemRules = [];
  var itemRenderer = null;

  if (typeof options['item-renderer-id'] === 'string') {
    var itemRendererPrototype =
        document.getElementById(options['item-renderer-id']);

    if (itemRendererPrototype !== null) {
      itemRenderer = itemRendererPrototype.cloneNode(true);

      if (itemRenderer !== null) {
        itemRenderer.removeAttribute('id');
      }
    }
  }

  if (options['item-template'] instanceof Object) {
    itemRules = tt.rules.createRules(options['item-template']);
  }

  if (itemRenderer !== null) {
    return new tt.view.helpers.ListViewHelper(itemRenderer, itemRules);
  }

  return null;
};


/**
 * @param {!Object} options Настрокий.
 * @return {tt.view.helpers.ITemplateViewHelper} Объект помощи отрисовке.
 */
tt.view.__createTextViewHelper = function(options) {
  var pattern = [];

  if (typeof options['pattern'] === 'string') {
    pattern = options['pattern'].split('$$');
  }

  return new tt.view.helpers.TextViewHelper(pattern);
};


/**
 * @param {!Object} options Настрокий.
 * @return {tt.view.helpers.ITemplateViewHelper} Объект помощи отрисовке.
 */
tt.view.__createAttributeViewHelper = function(options) {
  var pattern = [];

  if (typeof options['pattern'] === 'string') {
    pattern = options['pattern'].split('$$');
  }

  if (typeof options['name'] === 'string') {
    return new tt.view.helpers.AttributeViewHelper([options['name']], pattern);
  } else if (options['name'] instanceof Array) {
    return new tt.view.helpers.AttributeViewHelper(
        util.toStringArray(options['name']), pattern);
  }

  return null;
};


/**
 * @param {!Object} options Настрокий.
 * @return {tt.view.helpers.ITemplateViewHelper} Объект помощи отрисовке.
 */
tt.view.__createCaseViewHelper = function(options) {
  var isRegExp = Boolean(options['is-reg-exp']);

  var cases = [];
  var caseClasses = [];
  var regExps = [];
  var regExpClasses = [];

  for (var key in options['cases']) {
    if (isRegExp) {
      try {
        regExps.push(new RegExp(key));
        regExpClasses.push(options['cases'][key]);
      } catch (error) {}
    } else {
      cases.push(key);
      caseClasses.push(options['cases'][key]);
    }
  }

  return new tt.view.helpers.CaseViewHelper(
      cases, caseClasses, regExps, regExpClasses);
};

