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
 * @param {!Array.<string>} cases Список ожидаемых строковых значений.
 * @param {!Array.<string>} caseClasses Соответсвующие значениям классы.
 * @param {!Array.<!RegExp>} regExps Регулярные выражения.
 * @param {!Array.<string>} regExpsClasses Соответсвующие регулярным выражениям
 *    классы.
 */
tt.view.helpers.CaseViewHelper =
    function(cases, caseClasses, regExps, regExpsClasses) {

  /**
   * @type {!Array.<string>}
   */
  this.__cases = cases;

  /**
   * @type {!Array.<string>}
   */
  this.__caseClasses = caseClasses;

  /**
   * @type {!Array.<!RegExp>}
   */
  this.__regExps = regExps;

  /**
   * @type {!Array.<string>}
   */
  this.__regExpsClasses = regExpsClasses;
};

util.inherits(tt.view.helpers.CaseViewHelper,
              tt.view.helpers.SimpleViewHelper);


/**
 * @param {!Node} element Элемент.
 * @param {*} value Значение.
 */
tt.view.helpers.CaseViewHelper.prototype.process = function(element, value) {
  var str = value === null ? '' : value.toString();

  var i = 0,
      l = this.__cases.length;

  while (i < l) {
    if (this.__caseClasses[i] !== undefined) {
      util.dom.setClassExist(
          element, this.__caseClasses[i], this.__cases[i] === str);
    }

    i += 1;
  }

  i = 0;
  l = this.__regExps.length;
  while (i < l) {
    if (this.__regExpsClasses[i] !== undefined) {
      util.dom.setClassExist(
          element, this.__regExpsClasses[i], this.__regExps[i].test(str));
    }

    i += 1;
  }
};
