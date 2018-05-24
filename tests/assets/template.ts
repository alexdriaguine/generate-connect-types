import * as prettier from 'prettier'

export const connectedProps = [
  {name: 'index', value: 'state.index', type: 'number'},
  {name: 'name', value: 'state.name', type: 'string'},
  {name: 'ble', value: 'state.bla', type: 'Bla'},
  {name: 'hoho', value: 33, type: 'number'},
  {
    name: 'nested',
    value: 'state.nested',
    type: '{nested: {as: {fudge: true}}}',
  },
]

export const connectedDispatch = [
  {name: 'signIn', value: '() => console.log()', type: '() => void'},
]

export const expectedInterface = `interface ConnectProps {
  ${connectedProps.map(p => `${p.name}: ${p.type}`).join('\n  ')}
  ${connectedDispatch.map(p => `${p.name}: ${p.type}`).join('\n  ')}
}
`

export const templateInferred = prettier.format(
  `import {
  connect as _connect,
  InferableComponentEnhancerWithProps,
} from 'react-redux'
import {MapDispatchToProps, MergeProps, Options} from 'react-redux'

type Bla = {
  foo: string
}
interface State {
  index: number
  name: string
  bla: Bla
  nested: {
    as: {
      fudge: boolean
    }
  }
}
const state: State = {
  index: 1,
  name: 'bla',
  bla: {
    foo: 'asd',
  },
  nested: {
    as: {
      fudge: true
    }
  }
}

type MapStateToProps = (state: State) => any

const connect = function(
  mapStateToProps?: MapStateToProps,
  mapDispatchToProps?: MapDispatchToProps<any, any>,
  mergeProps?: MergeProps<any, any, any, any>,
  options?: Options,
): InferableComponentEnhancerWithProps<any, any> {
  return _connect.apply(undefined, arguments)
}

const Comp = props => <div>hehe</div>

const t = connect(
  (state: State) => ({
    ${connectedProps.map(p => `${p.name}: ${p.value}`).join(',\n')}
  }),
  () => ({
    ${connectedDispatch.map(p => `${p.name}: ${p.value}`).join(',\n')}
  }),
)(Comp)
`,
  {parser: 'typescript'},
)

export const template = prettier.format(
  `
import {connect} from 'react-redux'
import * as prettier from 'prettier';

type Bla = {
  foo: string
}
interface State {
  index: number
  name: string
  bla: Bla
  nested: {
    as: {
      fudge: boolean
    }
  }
}
const state: State = {
  index: 1,
  name: 'bla',
  bla: {
    foo: 'asd',
  },
  nested: {
    as: {
      fudge: true
    }
  }
}

const Comp = (props) => <div>hehe</div>

const t = connect(
  (state: State) => ({
    ${connectedProps.map(p => `${p.name}: ${p.value}`).join(',\n')}
  }),
  () => ({
    ${connectedDispatch.map(p => `${p.name}: ${p.value}`).join(',\n')}
  }),
)(Comp)`,
  {parser: 'typescript'},
)
