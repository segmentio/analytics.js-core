test-e2e:
	npx codeceptjs run --steps

build: clean install
	yarn tsc
clean:
	rm -rf build

install:
	yarn

.PHONY: test-e2e build clean install
