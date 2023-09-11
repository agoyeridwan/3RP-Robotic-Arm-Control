const inputX = document.querySelector(".input_axisx");
const inputY = document.querySelector(".input_axisy");
const inputZ = document.querySelector(".input_axisz");
const textX = document.querySelector(".text_x");
const textY = document.querySelector(".text_y");
const textZ = document.querySelector(".text_z");
const increaseJ1 = document.querySelector(".plusj1");
const decreaseJ1 = document.querySelector(".minusj1");
const progressJ1 = document.querySelector(".progress_bar_j1");
const inputJ1 = document.querySelector(".inputj1");
const increaseJ2 = document.querySelector(".plusj2");
const decreaseJ2 = document.querySelector(".minusj2");
const progressJ2 = document.querySelector(".progress_bar_j2");
const inputJ2 = document.querySelector(".inputj2");
const increaseJ3 = document.querySelector(".plusj3");
const decreaseJ3 = document.querySelector(".minusj3");
const progressJ3 = document.querySelector(".progress_bar_j3");
const inputJ3 = document.querySelector(".inputj3");
const increaseZ = document.querySelector(".plusz");
const decreaseZ = document.querySelector(".minusz");
const progressZ = document.querySelector(".progress_bar_z");
const inputjZ = document.querySelector(".inputz");
const moveToPosition = document.querySelector(".texts");
const savedPosition = document.querySelector(".none");
const positioning = document.querySelector(".positioning");
const clear = document.querySelector(".clear");
const update = document.querySelector(".update");
const runProgram = document.querySelector(".run");
const openValue = document.querySelector(".openValue");
const slider = document.getElementById("slider");
const sliderValue = document.getElementById("sliderValue");
const slider1 = document.getElementById("slider1");
const slider2 = document.getElementById("slider2");
const sliderValue2 = document.getElementById("sliderValue2");

let position = [];
const increment = function (increase, progress, input, type) {
  increase.addEventListener("click", async () => {
    const progressContent = +input.value + +progress.textContent;
    progress.textContent = progressContent;
    let progressJ1Width = (progressContent / 100) * 100;
    if (progressJ1Width > 100) {
      progressJ1Width = 100;
      progress.textContent = 100;
      alert("You have exceeded the maximum angle");
    }
    progress.style.setProperty("width", `${progressJ1Width}%`);
    await handleUrl(`${type}=${progress.textContent}`);
  });
};

decrement = function (decrease, progress, input, type) {
  decrease.addEventListener("click", async () => {
    const progressContent = +progress.textContent - Number(input.value);
    progress.textContent = progressContent;
    let progressJ1Width = (progressContent / 100) * 100;
    if (progressJ1Width < 0) {
      progressJ1Width = 0;
      progress.textContent = 0;
      alert("You have excedded the minimum angle");
    }
    progress.style.setProperty("width", `${progressJ1Width}%`);
    await handleUrl(`${type}=${progress.textContent}`);
  });
};
async function handleUrl(data) {
  if (typeof data === "object") data = `${data[0]} ${data[1]} ${data[2]}`;
  try {
    // Note this only works when it is being hosted on the microcontroller
    await fetch(`http://${window.location.hostname}/?data=${data}`, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } catch (error) {}
}
function manipulateSlider(slide, slideValue, status = false) {
  slide.addEventListener("input", async () => {
    slideValue.innerHTML = `<b>Value: ${slide.value}</b>`;
    if (!status) slideValue.innerHTML = `<b>${slide.value}</b>`;
    console.log(slide.value);
    await handleUrl(slide.value);
  });
}

increment(increaseJ1, progressJ1, inputJ1, "J1");
decrement(decreaseJ1, progressJ1, inputJ1, "J1");
increment(increaseJ2, progressJ2, inputJ2, "J2");
decrement(decreaseJ2, progressJ2, inputJ2, "J2");
increment(increaseJ3, progressJ3, inputJ3, "J3");
decrement(decreaseJ3, progressJ3, inputJ3, "J3");
increment(increaseZ, progressZ, inputjZ, "Z");
decrement(decreaseZ, progressZ, inputjZ, "Z");
moveToPosition.addEventListener("click", async () => {
  let values = [];
  textX.textContent = `X: ${+inputX.value}`;
  values.push(+inputX.value);
  textY.textContent = `Y: ${+inputY.value}`;
  values.push(+inputY.value);
  textZ.textContent = `Z: ${+inputZ.value}`;
  values.push(+inputZ.value);
  console.log(values);
  await handleUrl(values);
});
positioning.addEventListener("click", () => {
  position = [];
  position.push(+inputX.value);
  position.push(+inputY.value);
  position.push(+inputZ.value);
  savedPosition.innerHTML = `<b>X: ${position[0]} Y: ${position[1]} Z: ${position[2]}<b>`;
});
clear.addEventListener("click", () => {
  savedPosition.innerHTML = "<b>None<b>";
  position = [];
});

manipulateSlider(slider, sliderValue);
manipulateSlider(slider2, sliderValue2);
manipulateSlider(slider1, openValue, true);
runProgram.addEventListener("click", async () => {
  await handleUrl(position);
});
