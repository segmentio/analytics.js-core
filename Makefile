##
# Binaries
##

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

# Install dependencies.
install:
	yarn

# Build typescript
build: clean install
	yarn tsc
.PHONY: build

# Remove temporary files and build artifacts.
clean:
	rm -rf *.log coverage build
	rm -f ./test-e2e/static/analytics.js
.PHONY: clean

# Remove temporary files, build artifacts, and vendor dependencies.
distclean: clean
	rm -rf node_modules
.PHONY: distclean

# Lint JavaScript source files.
lint: install
	yarn lint

.PHONY: lint

# Attempt to fix linting errors.
fmt: install
	yarn format
.PHONY: fmt

# Run browser unit tests in a browser.
test-browser: build
	@$(KARMA) start $(KARMA_FLAGS) $(KARMA_CONF)
.PHONY: test-browser

# Default test target.
test: lint test-browser
.PHONY: test

# Commands to start/stop devServer for e2e tests
start_dev_server = (yarn ts-node ./test-e2e/devServer.ts)
stop_dev_server = (pkill SIGTERM ajs-test-e2e-dev-server)

start-dev-server:
	$(call start_dev_server)

stop-dev-server:
	$(call stop_dev_server) || true

# Run e2e tests
test-e2e: install stop-dev-server
	yarn ts-node ./test-e2e/devServer.ts &
	rm -rf ./test-e2e/output
	rm -rf ./test-e2e/staging
	mkdir ./test-e2e/staging
	yarn wait-on http://localhost:8000 && npx codeceptjs run --steps
	$(call stop_dev_server)
.PHONY: test-e2e

.DEFAULT_GOAL = test
