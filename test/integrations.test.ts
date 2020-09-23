import sinon from 'sinon'
import axios from 'axios'
import assert from 'proclaim'

import { loadIntegrationsOnDemand } from '../lib/integrations';


let stub

describe("loadIntegrationsOnDemand", () => {
  before(() => {
    const promise = Promise.resolve({
      integrations: {
        "Segment.io": {
          "apiKey": "abc",
          "apiHost": "api.segment.build/v1"
        }
      }
    })
    stub = sinon.stub(axios, "get").returns(promise)
  })

  after(() => {
    sinon.restore()
  })


  it("should load integrations that are enabled", () => {
    loadIntegrationsOnDemand("abc")
    assert(stub.calledOnce)
  })
});