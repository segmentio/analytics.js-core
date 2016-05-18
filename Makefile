##
# Binaries
##

ESLINT := node_modules/.bin/eslint
KARMA := node_modules/.bin/karma

##
# Files
##

LIBS = $(shell find lib -type f -name "*.js")
TESTS = $(shell find test -type f -name "*.test.js")
SUPPORT = $(wildcard karma.conf*.js)
ALL_FILES = $(LIBS) $(TESTS) $(SUPPORT)

##
# Program options/flags
##

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

##
# Tasks
##

# Install node modules.
node_modules: package.json $(wildcard node_modules/*/package.json)
	@npm install
	@touch $@

# Install dependencies.
install: node_modules

# Remove temporary files and build artifacts.
clean:
	rm -rf *.log coverage
.PHONY: clean

# Remove temporary files, build artifacts, and vendor dependencies.
distclean: clean
	rm -rf node_modules
.PHONY: distclean

# Lint JavaScript source files.
lint: install
	@$(ESLINT) $(ALL_FILES)
.PHONY: lint

# Attempt to fix linting errors.
fmt: install
	@$(ESLINT) --fix $(ALL_FILES)
.PHONY: fmt

# Run browser unit tests in a browser.
test-browser: install
	@$(KARMA) start $(KARMA_FLAGS) $(KARMA_CONF)
.PHONY: test-browser

# Default test target.
test: lint test-browser
.PHONY: test
.DEFAULT_GOAL = test
