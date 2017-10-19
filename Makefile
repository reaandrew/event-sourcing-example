.PHONY: test
test: dev_deps
	./node_modules/mocha/bin/mocha --recursive

.PHONY: lint
lint: dev_deps
	./node_modules/eslint/bin/eslint.js --fix .

.PHONY: cvm
cvm: dev_deps
	./node_modules/snyk/cli/index.js test

.PHONY: dev_deps
dev_deps: *.js
	npm install -d

.PHONY: mutation
mutation:
	./node_modules/stryker/bin/stryker run stryker.conf.js

.PHONY: build
build: cvm lint test mutation
