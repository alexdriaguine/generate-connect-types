import {
  connect as _connect,
  InferableComponentEnhancerWithProps
} from "react-redux";
import { MapDispatchToProps, MergeProps, Options } from "react-redux";


interface ConnectProps {
  index: number;
  name: string;
  ble: Bla;
  hoho: number;
  nested: { as: { fudge: boolean } };
  signIn: () => void;
}


type Bla = {
  foo: string;
};
interface State {
  index: number;
  name: string;
  bla: Bla;
  nested: {
    as: {
      fudge: boolean;
    };
  };
}
const state: State = {
  index: 1,
  name: "bla",
  bla: {
    foo: "asd"
  },
  nested: {
    as: {
      fudge: true
    }
  }
};

type MapStateToProps = (state: State) => any;

const connect = function(
  mapStateToProps?: MapStateToProps,
  mapDispatchToProps?: MapDispatchToProps<any, any>,
  mergeProps?: MergeProps<any, any, any, any>,
  options?: Options
): InferableComponentEnhancerWithProps<any, any> {
  return _connect.apply(undefined, arguments);
};

const Comp = props => <div>hehe</div>;

const t = connect(
  (state: State) => ({
    index: state.index,
    name: state.name,
    ble: state.bla,
    hoho: 33,
    nested: state.nested
  }),
  () => ({
    signIn: () => console.log()
  })
)(Comp);
