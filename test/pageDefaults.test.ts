import { pageDefaults }  from '../build/pageDefaults'
import * as assert from 'proclaim'
import * as sinon from 'sinon'

const el = document.createElement("link")
el.setAttribute("rel", "canonical")

const loc = window.location

describe('pageDefaults', () => {
  before(() => {
    el.setAttribute("href", "")
    sinon.stub(document, 'querySelector').returns(el)
  })

  after(() => {
    sinon.restore()
  })

  it('handles no canonical links', () => {
    const defs = pageDefaults()
    assert.isNotNull(defs.url)
  })

  it('handles canonical links', () => {
    el.setAttribute("href", "http://www.segment.local")
    const defs = pageDefaults()
    assert.equal(defs.url, "http://www.segment.local")
  })

  it('handles canonical links with a path', () => {
    el.setAttribute("href", "http://www.segment.local/test")
    const defs = pageDefaults()
    assert.equal(defs.url, "http://www.segment.local/test")
    assert.equal(defs.path, "/test")
  })

  it('handles canonical links with search params in the url', () => {
    el.setAttribute("href", "http://www.segment.local?test=true")
    const defs = pageDefaults()
    assert.equal(defs.url, "http://www.segment.local?test=true")
  })
})
