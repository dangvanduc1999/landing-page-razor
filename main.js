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
class State {
  constructor(element, initState, callback = () => {}) {
    this.element = element;
    this.state = initState;
    this.element.setAttribute("data-state", initState);
    this.callback = callback;
  }
  setState(newState) {
    this.state = newState;
    this.subcriber();
    this.element.setAttribute("data-state", newState);
  }
  subcriber() {
    this.callback(this.state);
  }
}
function handleSpin(state) {
  const status = {
    pendding: "pendding",
    spin: "spin",
  };
  const prevState = btnSpin.getAttribute("data-state");
  btnSpin.classList.remove(prevState);
  btnSpin.classList.add(status[state]);
}

// this function is fake api call
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toast);
const btnTextPriceState = new State(btnTextPrice, false);
const btnSpinState = new State(btnSpin, "pendding", handleSpin);
//===== END INIT REGION ==== //

//====== MAIN LOGIC =========//
const listGroupItemPrice = $all(".list-group-item");

/* Hanlde change text when click price */
listGroupItemPrice.forEach((element) => {
  element.addEventListener("click", (e) => {
    const text = e.target.innerHTML;
    btnTextPrice.innerHTML = text;
    btnTextPriceState.setState(true);
  });
});
btnSpin.addEventListener("click", () => {
  if (!btnTextPriceState.state) {
    return toastBootstrap.show();
  }
  btnSpinState.setState("spin");
  sleep(3000).then(() => {
    btnSpinState.setState("pendding");
    // handle logic show modal here
    myModal.show();
  });
});
btnContiue.addEventListener("click", (e) => {
  myModal.toggle();
  btnSpinState.setState("pendding");
  btnTextPrice.innerHTML = "Chọn giải thưởng";
});
