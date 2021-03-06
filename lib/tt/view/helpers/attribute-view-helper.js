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
 * @constructor
 * @extends {tt.view.helpers.SimpleViewHelper}
 * @param {string} name Имя аттрибута.
 * @param {!Array.<string>} pattern Шаблон отображения текста.
 */
tt.view.helpers.AttributeViewHelper = function(name, pattern) {

  /**
   * @type {!Array.<string>}
   */
  this.__pattern = pattern;

  /**
   * @type {string}
   */
  this.__attributeName = name;
};

util.inherits(tt.view.helpers.AttributeViewHelper,
              tt.view.helpers.SimpleViewHelper);


/**
 * @inheritDoc
 */
tt.view.helpers.AttributeViewHelper.prototype.process =
    function(element, value) {

  var name = this.__attributeName;

  if (value !== null) {
    var attrValue =
        this.__pattern.length > 0 ? this.__pattern.join(value) : value;

    if (element[name] === undefined || name === 'style') {
      element.setAttribute(name, attrValue);
    } else {
      element[name] = attrValue;
    }
  } else {
    if (element[name] === undefined) {
      element.removeAttribute(name);
    } else {
      element[name] = '';
    }
  }
};
