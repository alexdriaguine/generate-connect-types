import {connect} from 'react-redux'

interface ConnectProps {
  index: number
  name: string
  ble: Bla
  hoho: number
  signIn: () => void
}

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
    index: state.index,
name: state.name,
ble: state.bla,
hoho: 33
  }),
  () => ({
    signIn: () => console.log()
  }),
)(Comp)