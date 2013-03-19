JS_BUILD_HOME ?= /usr/lib/js-build-tools


#
#	Variables
#

JS_ROOT_DIR = ./
JS_DEFAULT_ENV = browser
JS_DEPS_DIRS = ../util/

MODULE_NAME = tt

include $(JS_BUILD_HOME)/js-variables.mk


#
#	Rules
#

all : js-externs js-export

check : js-test-lint js-test-compile

clean : js-clean

include $(JS_BUILD_HOME)/js-rules.mk
