build: components
	@component build --out ./build --copy # no symlinks for heroku

build-dev: components-dev
	component build --out ./build --copy --dev

clean:
	rm -fr components build public

components: component.json
	component install

components-dev: component.json
	component install --dev

test: build
	foreman start

.PHONY: clean test