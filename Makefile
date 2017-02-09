
# A list of options to pass to Karma
# Overriding this overwrites all options specified in this file (e.g. BROWSERS)
KARMA_FLAGS ?=

# A list of Karma browser launchers to run
# http://karma-runner.github.io/0.13/config/browsers.html
BROWSERS ?=
ifdef BROWSERS
KARMA_FLAGS += --browsers $(BROWSERS)
endif

ifdef CI
KARMA_CONF ?= karma.conf.ci.js
else
KARMA_CONF ?= karma.conf.js
endif

# Mocha flags.
GREP ?= .

.DEFAULT_GOAL = test

node_modules: package.json $(wildcard node_modules/*/package.json)
	npm install
	touch $@

clean:
	rm -rf *.log coverage

distclean: clean
	rm -rf node_modules

lint: node_modules
	./node_modules/.bin/standard

fmt: node_modules
	./node_modules/.bin/standard --fix

test-browser: node_modules
	./node_modules/.bin/karma start $(KARMA_FLAGS) $(KARMA_CONF)

test: lint test-browser

.PHONY: clean test lint fmt distclean test-browser
