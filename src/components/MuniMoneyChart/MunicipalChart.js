export default class MunicipalChart {
  constructor () {
    this._node = document.createElement('div')
    this._node.innerText = `${this.constructor.name} DOM Node`
  }

  node () {
    return this._node
  }
}