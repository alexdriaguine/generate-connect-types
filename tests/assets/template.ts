export const connectedProps = [
  {name: 'index', value: 'state.index', type: 'number'},
  {name: 'name', value: 'state.name', type: 'string'},
  {name: 'ble', value: 'state.bla', type: 'Bla'},
  {name: 'hoho', value: 33, type: 'number'},
]

export const connectedDispatch = [
  {name: 'signIn', value: '() => console.log()', type: '() => void'},
]

export const expectedInterface = `interface ConnectProps {
  ${connectedProps.map(p => `${p.name}: ${p.type}`).join('\n  ')}
  ${connectedDispatch.map(p => `${p.name}: ${p.type}`).join('\n  ')}
}
`

export const template = `import {connect} from 'react-redux'

type Bla = {
  foo: string
}
interface State {
  index: number
  name: string
  bla: Bla
}
const state: State = {
  index: 1,
  name: 'bla',
  bla: {
    foo: 'asd',
  },
}

const Comp = (props) => <div>hehe</div>

const t = connect(
  (state: State) => ({
    ${connectedProps.map(p => `${p.name}: ${p.value}`).join(',\n')}
  }),
  () => ({
    ${connectedDispatch.map(p => `${p.name}: ${p.value}`).join(',\n')}
  }),
)(Comp)`
