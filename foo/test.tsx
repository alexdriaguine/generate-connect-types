import {connect} from 'react-redux'

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

const Comp = () => <div>hehe</div>

const t = connect(
  (state: State) => ({
    index: state.index,
    name: state.name,
    ble: state.bla,
    hoho: 33,
  }),
  () => ({
    dispatch: () => console.log('hej'),
  }),
)(Comp)
