const $ = document.querySelector.bind(document);
const $all = document.querySelectorAll.bind(document);
//===== CONSTANT ELEMENT ==== //
const btnTextPrice = $("#btnTextPrice");
const btnCollapseOne = $("#btnCollapseOne");
const btnSpin = $("#btn-spin");
const toast = $("#liveToast");
const myModal = new bootstrap.Modal($("#exampleModal"));
const btnContiue = $(".btn-pj");
//===== END CONSTANT ELEMENT  REGION==== //

//=====INIT REGION ==== //
/* The State class allows for the management and updating of state in JavaScript, with the ability to
subscribe to changes and update HTML elements. */
class State {
  constructor(element, initState, callback = () => {}) {
    this.element = element;
    this.state = initState;
    if (element) {
      this.element.setAttribute("data-state", initState);
    }
    this.callback = callback;
  }
  setState(newState) {
    this.state = newState;
    this.subcriber();
    if (this.element) {
      this.element.setAttribute("data-state", newState);
    }
  }
  subcriber() {
    this.callback(this.state);
  }
}

/**
 * The function handles the spinning state of a button by updating its class based on the current
 * state.
 * @param state - The parameter "state" is a string that represents the new state of the button. It can
 * be either "pending" or "spin".
 */

function handleSpin(state) {
  const status = {
    pendding: "pendding",
    spin: "spin",
  };
  const prevState = btnSpin.getAttribute("data-state");
  btnSpin.classList.remove(prevState);
  btnSpin.classList.add(status[state]);
}
/**
 * The function handles the current active element by removing the "option-prize-active" class from the
 * current element and adding it to a new element based on the provided state.
 * @param state - The `state` parameter is an object that contains information about the current state
 * of the application. It likely includes properties such as `prizeParent` and `prizeChildKey`, which
 * are used to identify a specific element in the DOM. The `handleCurrent` function is responsible for
 * updating the
 */
function handleCurrent(state) {
  const currentElementActive = $(".option-prize-active");
  if (currentElementActive) {
    currentElementActive.classList.remove("option-prize-active");
  }
  $(
    `[prize-parent="${state.prizeParent}"][prize-child-key="${state.prizeChildKey}"]`
  ).classList.add("option-prize-active");
}

// this function is fake api call
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const DEFAULT_TIME_SCROLL = 5000;
const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toast);
const btnTextPrizeState = new State(btnTextPrice, false);
const btnSpinState = new State(btnSpin, "pendding", handleSpin);
const currentPrize = new State(
  null,
  {
    prizeChildKey: null,
    prizeParent: null,
    labelPrize: "",
  },
  handleCurrent
);
//===== END INIT REGION ==== //

//====== MAIN LOGIC =========//
const listGroupItemPrice = $all(".list-group-item");

/*select prize and  hanlde change text when click prize */
listGroupItemPrice.forEach((element) => {
  element.addEventListener("click", (e) => {
    const text = e.target.innerHTML;
    btnTextPrice.innerHTML = text;
    btnTextPrizeState.setState(true);
    currentPrize.setState({
      prizeChildKey: e.target.getAttribute("prize-child-key"),
      prizeParent: e.target.getAttribute("prize-parent"),
      labelPrize: text,
    });
  });
});
// handle click btn razor spin button

btnSpin.addEventListener("click", () => {
  if (!btnTextPrizeState.state) {
    return toastBootstrap.show();
  }
  btnSpinState.setState("spin");
  // fake call api here
  sleep(3000).then(() => {
    // clear spin when api done
    btnSpinState.setState("pendding");
    // handle logic show modal here
    myModal.show();
  });
});
// handle click btn continue on modal button

btnContiue.addEventListener("click", (e) => {
  myModal.toggle();
  btnSpinState.setState("pendding");
  btnTextPrice.innerHTML = "Chọn giải thưởng";
});

//auto scroll down
function autoScrollDown() {
  const element = $("#scroll-table");
  if (element.scrollHeight > element.clientHeight) {
    const heightDifference = element.scrollHeight - element.clientHeight;
    const animationDuration = 1000; // thời gian cuộn mượt (ms)
    const framesPerSecond = 60; // số khung hình trên giây
    const frameIncrement =
      heightDifference / ((animationDuration / 1000) * framesPerSecond);
    let scrollTop = element.scrollTop;
    const animation = () => {
      scrollTop += frameIncrement;
      if (scrollTop >= heightDifference) {
        element.scrollTop = heightDifference;
      } else {
        element.scrollTop = scrollTop;
        requestAnimationFrame(animation);
      }
    };
    requestAnimationFrame(animation);
  }
}

setInterval(autoScrollDown, DEFAULT_TIME_SCROLL);
