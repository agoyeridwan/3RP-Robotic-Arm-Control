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
const savedPos = document.querySelector(".pos");
let progressJ1Width;
let position = [];
let runStatus = 0;
let saveStatus = 0;
let saveArray = [];
let xP = 365;
let yP = 0;
let zP = 100;
let L1 = 228;
let L2 = 136.5;
let theta2 = 0;
let phi = 0;
let theta1 = 0;
let realProgressJ2 = 0;
let realContentJ1 = 0;
let gripperValue = 150;
let speed = 500;
let acceleration = 500;
const forwardKinematics = function (progressJ1, progressJ2) {
  let theta1F = (progressJ1 * Math.PI) / 180; // degrees to radians
  let theta2F = (progressJ2 * Math.PI) / 180;
  xP = Math.round(L1 * Math.cos(theta1F) + L2 * Math.cos(theta1F + theta2F));
  yP = Math.round(L1 * Math.sin(theta1F) + L2 * Math.sin(theta1F + theta2F));
  if (Number.isNaN(xP)) xP = 0;
  if (Number.isNaN(yP)) yP = 0;
  textX.textContent = `X: ${+xP}`;
  textY.textContent = `Y: ${+yP}`;
  return [xP, yP];
};
function resetWidth(val1, val2, val3) {
  progressJ1.textContent = val1;
  progressJ2.textContent = val2;
  progressJ3.textContent = val3;
  progressZ.textContent = zP;

  const progressJ1Width = ((val1 + 90) / 356) * 100;
  const progressJ2Width = ((val2 + 150) / 300) * 100;
  const progressJ3Width = ((val3 + 162) / 324) * 100;
  const z = (zP / 150) * 100;
  console.log("Z is ", z);
  console.log("ProgressJ1 width is ", progressJ1Width);
  progressJ1.style.setProperty("width", `${progressJ1Width}%`);
  progressJ2.style.setProperty("width", `${progressJ2Width}%`);
  progressJ3.style.setProperty("width", `${progressJ3Width}%`);
  progressZ.style.setProperty("width", `${z}%`);
  // zP = +inputZ.value;
}
function sq(x) {
  return x * x;
}
function sendData(values) {
  values.push(saveStatus);
  values.push(runStatus);
  values.push(theta1);
  values.push(theta2);
  values.push(phi);
  values.push(zP);
  values.push(gripperValue);
  values.push(speed);
  values.push(acceleration);
}
function inverseKinematics(x, y) {
  theta2 = Math.acos((sq(x) + sq(y) - sq(L1) - sq(L2)) / (2 * L1 * L2));
  console.log(theta2);
  if (x < 0 && y < 0) {
    theta2 = -1 * theta2;
  }

  theta1 =
    Math.atan(x / y) -
    Math.atan((L2 * Math.sin(theta2)) / (L1 + L2 * Math.cos(theta2)));

  theta2 = (-1 * theta2 * 180) / Math.PI;
  theta1 = (theta1 * 180) / Math.PI;

  // Angles adjustment depending in which quadrant the final tool coordinate x,y is
  if (x >= 0 && y >= 0) {
    // 1st quadrant
    theta1 = 90 - theta1;
  }
  if (x < 0 && y > 0) {
    // 2nd quadrant
    theta1 = 90 - theta1;
  }
  if (x < 0 && y < 0) {
    // 3d quadrant
    theta1 = 270 - theta1;
    phi = 270 - theta1 - theta2;
    phi = -1 * phi;
  }
  if (x > 0 && y < 0) {
    // 4th quadrant
    theta1 = -90 - theta1;
  }
  if (x < 0 && y == 0) {
    theta1 = 270 + theta1;
  }

  // Calculate "phi" angle so gripper is parallel to the X axis
  phi = 90 + theta1 + theta2;
  phi = -1 * phi;

  // Angle adjustment depending in which quadrant the final tool coordinate x,y is
  if ((x < 0) & (y < 0)) {
    // 3d quadrant
    phi = 270 - theta1 - theta2;
  }
  if (Math.abs(phi) > 165) {
    phi = 180 + phi;
  }

  theta1 = Math.round(theta1);
  theta2 = Math.round(theta2);
  phi = Math.round(phi);
  // zP = 100;
  console.log(isNaN);
  if (isNaN(theta1)) theta1 = 0;
  if (isNaN(theta2)) theta2 = 0;
  if (isNaN(phi)) phi = 0;
  alert(
    "The inverse kinematics calculation is undefined please change the coordinate values"
  );
  // zP = 100;
  resetWidth(theta1, theta2, phi);

  // console.log(theta1);
  // console.log(theta2);
  // console.log(phi);
}
const increment = function (increase, progress, input, type) {
  let progressContent = +progress.textContent;
  increase.addEventListener("click", async () => {
    console.log(input.value);
    progressContent = +input.value + +progress.textContent;
    progress.textContent = progressContent;

    let progressJ1Width = ((progressContent + 90) / 356) * 100;
    if (type === "J1") {
      const value = [];
      inputX.value = inputY.value = inputZ.value = "";
      realContentJ1 = progressContent;
      progressJ1Width = ((progressContent + 90) / 356) * 100;
      console.log("realContentJ1", realContentJ1);
      console.log("realProgressJ2", realProgressJ2);
      const values = forwardKinematics(realContentJ1, realProgressJ2);
      theta1 = realContentJ1;
      theta2 = realProgressJ2;
      sendData(value);
      console.log(value.join(","));
      // console.log(values[0], values[1]);
      if (progressContent > 266) {
        progressJ1Width = 100;
        progress.textContent = 266;

        alert("You have exceeded the maximum angle");
      }
      handleUrl(value);
    }
    if (type === "J2") {
      // if (!progressContent) progressContent = 0;
      inputX.value = inputY.value = inputZ.value = "";
      const value = [];
      progressJ1Width = ((progressContent + 150) / 300) * 100;
      realProgressJ2 = progressContent;
      console.log("realContentJ1", realContentJ1);
      console.log("realProgressJ2", realProgressJ2);
      console.log(forwardKinematics(realContentJ1, realProgressJ2));
      theta1 = realContentJ1;
      theta2 = realProgressJ2;
      sendData(value);
      // console.log(value.join(","));
      if (progressContent > 150) {
        progressJ1Width = 100;
        progress.textContent = 150;
        alert("You have exceeded the maximum angle");
      }
      handleUrl(value);
    }
    if (type == "J3") {
      const value = [];
      inputX.value = inputY.value = inputZ.value = "";
      progressJ1Width = ((progressContent + 162) / 324) * 100;
      phi = progressContent;
      sendData(value);
      console.log(value.join(","));
      if (progressContent > 162) {
        progressJ1Width = 100;
        progress.textContent = 162;
        alert("You have exceeded the maximum angle");
        console.log(progressJ1Width);
      }
      handleUrl(value);
    }
    if (type == "Z") {
      const value = [];
      inputX.value = inputY.value = inputZ.value = "";
      progressJ1Width = (progressContent / 150) * 100;
      zP = progressContent;
      textZ.textContent = `Z: ${progressContent}`;
      sendData(value);
      console.log(value.join(","));
      if (progressContent > 150) {
        progressJ1Width = 100;
        progress.textContent = 150;
        alert("You have exceeded the maximum angle");
        console.log(progressJ1Width);
      }
      await handleUrl(value);
    }
    progress.style.setProperty("width", `${progressJ1Width}%`);
    // await handleUrl(`${type}=${progress.textContent}`);
  });
};

decrement = function (decrease, progress, input, type) {
  let progressContent = +progress.textContent;
  decrease.addEventListener("click", async () => {
    progressContent = +progress.textContent - Number(input.value);
    progress.textContent = progressContent;
    if (type === "J1") {
      inputX.value = inputY.value = inputZ.value = "";
      const value = [];
      progressJ1Width = ((progressContent + 90) / 356) * 100;
      realContentJ1 = progressContent;
      console.log("realContentJ1", realContentJ1);
      console.log("realProgressJ2", realProgressJ2);
      console.log(forwardKinematics(realContentJ1, realProgressJ2));
      theta1 = realContentJ1;
      theta2 = realProgressJ2;
      sendData(value);
      console.log(value.join(","));
      if (progressContent < -90) {
        progressJ1Width = 0;
        progress.textContent = -90;
        alert("You have excedded the minimum angle");
      }
      await handleUrl(value);
    }
    if (type === "J2") {
      const value = [];
      inputX.value = inputY.value = inputZ.value = "";
      progressJ1Width = ((progressContent + 150) / 300) * 100;
      realProgressJ2 = progressContent;
      console.log("realContentJ1", realContentJ1);
      console.log("realProgressJ2", realProgressJ2);
      console.log(forwardKinematics(realContentJ1, realProgressJ2));
      theta1 = realContentJ1;
      theta2 = realProgressJ2;
      sendData(value);
      console.log(value.join(","));
      if (progressContent < -150) {
        progressJ1Width = 0;
        progress.textContent = -150;
        alert("You have excedded the minimum angle");
      }
      await handleUrl(value);
    }
    if (type === "J3") {
      inputX.value = inputY.value = inputZ.value = "";
      const value = [];
      progressJ1Width = ((progressContent + 162) / 324) * 100;
      phi = progressContent;
      console.log(progressJ1Width);
      sendData(value);
      console.log(value.join(","));
      if (progressContent < -162) {
        progressJ1Width = 0;
        progress.textContent = -162;
        alert("You have excedded the minimum angle");
      }
      await handleUrl(value);
    }
    if (type == "Z") {
      inputX.value = inputY.value = inputZ.value = "";
      const value = [];
      progressJ1Width = (progressContent / 150) * 100;
      zP = progressContent;
      textZ.textContent = `Z: ${progressContent}`;
      sendData(value);
      console.log(value.join(","));
      if (progressContent < 0) {
        progressJ1Width = 0;
        progress.textContent = 0;
        alert("You have exceeded the minimum angle");
        console.log(progressJ1Width);
      }
      await handleUrl(value);
    }
    progress.style.setProperty("width", `${progressJ1Width}%`);
  });
};
async function handleUrl(data) {
  data.join(",");
  if (typeof data === "object") data = `${data.join(",")}`;
  try {
    // Note this only works when it is being hosted on the microcontroller
    await fetch(`http://192.168.4.1/data?text=${data}`, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } catch (error) {}
}
function manipulateSlider(slide, slideValue, status = false, type) {
  slide.addEventListener("change", async () => {
    const values = [];

    count++;
    slideValue.innerHTML = `<b>Value: ${slide.value}</b>`;
    // console.log(slide);
    if (type == "slider2") {
      console.log(slide.value);
      acceleration = +slide.value;
    }
    if (type == "slider") {
      speed = +slide.value;
      // await handleUrl(values)
    }
    if (status) {
      slideValue.innerHTML = `<b>Value: ${slide.value}</b>`;

      gripperValue = 50 + Number(slide.value);
      // await handleUrl(values)
      console.log(slide.value);
    }
    sendData(values);
    // const joinedVal = values.join(",");
    console.log(values.join(","));
    await handleUrl(values);
  });
  count = 0;
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
  if (inputX.value) {
    inverseKinematics(+inputX.value, +inputY.value);
  }
  if (!inputX.value) {
    forwardKinematics(realContentJ1, realProgressJ2);
  }
  sendData(values);
  console.log(values);
  console.log(values.join(","));
  await handleUrl(values);
});
positioning.addEventListener("click", async () => {
  const stat = saveStatus++;
  const value = [];
  const position = [];
  savedPos.innerHTML = `<b>Last saved position ${stat}</b> `;
  sendData(value);
  console.log(value.join(","));
  position.push(inputX.value);
  position.push(inputY.value);
  position.push(inputZ.value);
  savedPosition.innerHTML = `<b>X: ${position[0]} Y: ${position[1]} Z: ${position[2]}<b>`;
  await handleUrl(value);
});
clear.addEventListener("click", () => {
  savedPosition.innerHTML = "<b>None<b>";
  position = [];
});
manipulateSlider(slider1, openValue, true);
manipulateSlider(slider, sliderValue, false, "slider");
manipulateSlider(slider2, sliderValue2, false, "slider2");

runProgram.addEventListener("click", async () => {
  console.log(runProgram.textContent);
  if (runProgram.textContent === "STOP") {
    runProgram.textContent = "RUN PROGRAM";
  } else {
    runProgram.textContent = "STOP";
  }
  if (runStatus == 0) {
    runStatus = 1;
  } else {
    runStatus = 0;
  }
  console.log(runStatus);
  await handleUrl(position);
});
document.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    if (inputX.value) {
      inverseKinematics(+inputX.value, +inputY.value);
      console.log(inputX.value);
      console.log(textX.textContent);
      textX.textContent = `X: ${inputX.value}`;
    }
    if (inputY.value) {
      inverseKinematics(+inputX.value, +inputY.value);
      textY.textContent = `Y: ${inputY.value}`;
    }
    if (inputZ.value) {
      zP = +inputZ.value;
      console.log(zP);
      inverseKinematics(+inputX.value, +inputY.value);
      textZ.textContent = `Z: ${inputZ.value}`;
    }
  }
});
