import { useEffect, useState } from "react";
import "./App.css";

type Node = {
  name: string;
  props: Record<string, string>;
  children: Node[];
};

type EventBus = {
  sendEvent: (event: string) => void;
  setTextInputValue: (id: string, value: string) => void;
};

const element = (node: Node, bus: EventBus) => {
  if (node.name === "rows") {
    return (
      <div className="rows">
        {node.children.map((child) => element(child, bus))}
      </div>
    );
  }

  if (node.name === "button") {
    return (
      <button
        className="button"
        onClick={() => {
          if (node.props.onClickEvent) {
            bus.sendEvent(node.props.onClickEvent);
          }
        }}
      >
        {node.props.label}
      </button>
    );
  }

  if (node.name === "text-input") {
    return (
      <input
        className="text-input"
        type="text"
        onChange={(e) => {
          if (node.props.id) {
            bus.setTextInputValue(node.props.id, e.target.value);
          }
        }}
      />
    );
  }

  return <>Unknown element</>;
};

function App() {
  const [el, setElement] = useState<Node | null>(null);
  const [textInputStates, setTextInputStates] = useState<
    Record<string, string>
  >({});

  const bus: EventBus = {
    sendEvent: (event: string) => {
      console.log(`Sending event: ${event}`);
    },
    setTextInputValue: (id: string, value: string) => {
      setTextInputStates((prevStates) => ({
        ...prevStates,
        [id]: value,
      }));
    },
  };

  useEffect(() => {
    fetch("http://localhost:8000/plugins/text-block-plugin/ui")
      .then((res) => res.json())
      .then((json) => setElement(json));
  }, []);

  return <>{el === null ? <div>Loading...</div> : element(el, bus)}</>;
}

export default App;
