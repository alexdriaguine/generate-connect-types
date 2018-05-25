import { connect } from "react-redux";
import * as prettier from "prettier";


interface ConnectProps {
  index: number;
  name: string;
  ble: Bla;
  hoho: number;
  nested: { as: { fudge: boolean } };
  signIn: () => void;
}



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
