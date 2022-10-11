// ------------------获取元素------------------
const logo = document.querySelector(".nav>div>.logo");
const navA = document.querySelector(".nav>div>a");
const form = document.querySelector(".form");
const btn = document.querySelector(".btn");
const input = document.querySelectorAll(".form>input");
const main = document.querySelector("main");
// const a_ink_2 = document.querySelectorAll(".nav>div>a:nth-child(-n+2)"); //选择前两个a（login和sign up）

// ------------------功能函数------------------

// 初始页面
const initPage = function () {
  // 初始化状态
  seeAllBrief = 1;
  state.setLoginUser("");
  formData.set_value([]);

  // 初始化页面
  logo.nextElementSibling.remove();
  navA.innerHTML = "Login";
  navA.insertAdjacentHTML(
    "afterend",
    "<a href='#' class='margin-right-small'>Sign up</a>"
  );
  main.innerHTML = "<span>Welcome to the bank</span>";
};

// 登陆成功的页面
const accountPage = function (username) {
  // 更新页面
  logo.insertAdjacentHTML(
    "afterend",
    `<span>Hello,${firstLetterU(username)}</span>`
  );
  navA.innerHTML = "Log off";
  navA.nextElementSibling.remove();
  form.classList.remove("form-recover");

  if (billsType()[0]["all"].length === 0) {
    main.innerHTML = `<div class="view">
              <div class="bills">
                <div class="item">
                  <span></span>
                  <span>----- 你还没有账单 -----</span>
                  <span></span>
                </div>
              </div>
              <div class="function-area">
                <div class="remainder"><span>你的余额为${calcRemainder()}￥</span></div>
                <form class="recharge">
                  <input type="text" placeholder="充值金额" class="margin-bottom-small" />
                  <button type="submit">充值</button>
                  <button type="reset">清空</button>
                </form>
              </div>
            </div>`;

    // 充值余额函数
    rechargeFunc();
  }

  if (billsType()[0]["all"].length === 0) return;

  billsView();
};

let order = true;
const billsView = function () {
  // 渲染view类
  funcView();

  // 渲染账单条目
  itemView();

  // 添加事件监听，排序功能
  viewFunc();

  // 充值余额函数
  rechargeFunc();
};

// 渲染账单条目
const itemView = function (type = "all", sort = false) {
  const bills = getBillsEl().bills;

  let bill = billsType()[0][type];

  // 排序规则
  if (sort) bill = order ? sortAscend(bill) : sortDecend(bill);
  order = !order;

  bill.map((v) => {
    // 判断类型
    const itemType = function (type1) {
      if (type1 === "class") {
        if (type === "all")
          return `class="${v > 0 ? "income" : "expense"}-icon"`;
        return `class="${type === "income" ? "income" : "expense"}-icon"`;
      }

      if (type1 === "icon") {
        if (type === "income")
          return "d ='M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941'";
        if (type === "expense")
          return "d ='M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.51l-5.511-3.181'";

        if (type === "all")
          return v > 0
            ? "d ='M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941'"
            : "d ='M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.51l-5.511-3.181'";
      }

      if (type1 === "number") {
        return v > 0 ? `+${v}` : v;
      }

      if (type1 === "text") {
        if (type === "all") return v > 0 ? "Income" : "Expense";
        if (type === "income") return "Income";
        if (type === "expense") return "Expense";
      }
    };

    // 插入html
    bills.insertAdjacentHTML(
      "afterbegin",
      `<div class="item">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      ${itemType("class")}
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        ${itemType("icon")}
        }}
      />
    </svg>
    <span>${itemType("number")}￥</span>
    <span>${itemType("text")}</span>
  </div>`
    );
  });
};

const funcView = function () {
  const viewHtml = `
<div class="view">
  <div class="bills">
    <div class="item">
      <div>仅查看收入</div>
      <div>仅查看支出</div>
      <div>排序</div>
    </div>
  </div>

  <div class="function-area">
    <div class="remainder"><span>你的余额为${calcRemainder()}￥</span></div>

    <form class="recharge">
      <input type="text" placeholder="充值金额" class="margin-bottom-small" />
      <button type="submit">充值</button>
      <button type="reset">清空</button>
    </form>

    <div class="transfer">
      <input
        type="text"
        placeholder="转账给谁？"
      />
      <input type="text" placeholder="金额" />
      <button class="margin-left-small">Go &rarr;</button>
    </div>
  </div>
</div>
`;

  main.innerHTML = viewHtml;
};

// 转账函数
const transfer = function () {
  const transferInput = getBillsEl().transferInput;
  transferInput.forEach((el) => {
    // 验证名字和数量
    if (el.value === "" || transferInput[1] <= 0) return;

    // 清空输入框
    el.value = "";

    // 验证余额
    if (calcRemainder() <= 0 && transferInput[1] > calcRemainder())
      popup("余额不足");

    if (calcRemainder() <= 0 && transferInput[1] > calcRemainder()) return;
    // 添加数量到账单
    addBillsList(transferInput[0].value, transferInput[1].value);
  });
};

let seeAllBrief = false;
let sortType = "all";
// 查看所有账单的按钮
const seeAll = function () {
  seeAllBrief = false;

  if (seeAllBrief) return;

  document
    .querySelector(".bills>.item>div:last-child")
    .insertAdjacentHTML("beforebegin", "<div>查看所有</div>");

  document
    .querySelector(".item:last-child>div:nth-child(3)")
    .addEventListener("click", () => {
      sortType = "all";
      itemView("all");
    });
};

// 信息弹窗
const popup = function (str) {
  document.body.insertAdjacentHTML(
    "beforeend",
    `
    <div class="popup">
      <span>${str}</span>
    </div>
  `
  );

  document.querySelector(".popup").classList.add("popup-recover");

  setTimeout(() => {
    document.querySelectorAll(".popup").forEach((el) => {
      el.remove();
    });
  }, 3000);
};

// ------------------事件监听函数------------------

// 获取bills和transferInput元素，因为一开始不在页面上
const getBillsEl = function () {
  const bills = document.querySelector(".bills");
  const transferInput = document.querySelectorAll(".transfer>input");

  return { bills, transferInput };
};

// 监听提交事件
form.addEventListener("submit", (e) => {
  e.preventDefault();

  // 获取表单数据
  let data = new FormData(form).getAll("value");

  // 清空输入框
  input.forEach((el) => {
    el.value = "";
  });

  // 关闭表单
  form.classList.remove("form-recover");

  // 表单输入格式验证
  if (data === "" || data[0].includes(" ") || data[1].includes(" ")) return;

  // 添加数据
  formData.set_value(data);
  formData.value_mode();

  // 验证账户
  loginVerification();
});

// 充值余额函数
const rechargeFunc = function () {
  const recharge = document.querySelector(".recharge");

  recharge.addEventListener("submit", (e) => {
    e.preventDefault();

    const amount = recharge.firstElementChild.value;
    if (amount === "") return;

    recharge.firstElementChild.value = "";

    addBillsList(state.getLoginUser(), amount);
    funcView();
    itemView();
    popup("充值成功");
  });
};

document.body.addEventListener("click", (e) => {
  // 关闭表单
  if (e.target.closest(".form")) return;
  e.target.textContent === "Login" || e.target.textContent === "Sign up"
    ? form.classList.toggle("form-recover")
    : form.classList.remove("form-recover");

  // 判断点了登录还是注册
  if (e.target.textContent === "Login") {
    btn.setAttribute("data-mode", "login");
  }
  if (e.target.textContent === "Sign up") {
    btn.setAttribute("data-mode", "sign-up");
  }

  // 登出
  if (e.target.textContent === "Log off") {
    initPage();
  }
});

const viewFunc = function () {
  // 排序类型
  // 三个排序功能按钮
  document
    .querySelector(".item:last-child>div:first-child")
    .addEventListener("click", () => {
      sortType = "income";
      itemView("income");
      seeAll();
      seeAllBrief = true;
    });

  document
    .querySelector(".item:last-child>div:nth-child(2)")
    .addEventListener("click", () => {
      sortType = "expense";
      itemView("expense");
      seeAll();
      seeAllBrief = true;
    });

  document
    .querySelector(".item:last-child>div:last-child")
    .addEventListener("click", () => {
      itemView(sortType, "true");
    });

  // 转账按钮
  document
    .querySelector(".transfer>button")
    .addEventListener("click", transfer);

  // 回车等同确认
  getBillsEl().transferInput[1].addEventListener("keydown", (e) => {
    if (e.key === "Enter") transfer();
  });
};
