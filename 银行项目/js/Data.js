// 预设账户
const accounts = [
  {
    username: "y",
    password: "y",
    bills: [
      100, -205, 138, -890, 146, 284, -500, 100, -205, 138, -890, 146, 284,
      -500, 100, -205, 138, -890, 146, 284, -500, 100, -205, 138, -890, 146,
      284, -500,
    ],
  },
  {
    username: "j",
    password: "j",
    bills: [100, -205, 138, -890, 146, 284, -500],
  },
];

const getAllUsername = function () {
  return accounts.map((obj) => {
    return obj.username;
  });
};

// 状态对象
const state = {
  _loginUser: "",

  getLoginUser() {
    return this._loginUser;
  },

  setLoginUser(str) {
    this._loginUser = str;
  },
};

// 表单数据
const formData = {
  _value: "",

  // 获取登录还是注册
  value_mode() {
    this._value.push(btn.dataset.mode);
  },

  get_value() {
    return this._value;
  },

  set_value(value) {
    this._value = value;
  },
};

// 账户验证
const loginVerification = function () {
  const [un, pw, type] = formData.get_value();
  const allUsername = getAllUsername();

  // 如果是登录
  if (type === "login") {
    // 是否拥有账户
    let isHas = true;

    if (!allUsername.includes(un)) {
      isHas = false;
      popup("你还没有账号，请注册！");
    }

    if (!isHas) return;

    // 如果账户存在
    // 验证账号密码
    if (
      accounts.map((obj) => {
        return obj.password === pw;
      })
    )
      isHas = true;

    // 清空输入数据
    formData.set_value([]);
    if (!isHas) return;
    // 更新登录状态
    state.setLoginUser(un);
    // 更新页面
    accountPage(un);
  }

  // 如果是注册
  if (type === "sign-up") {
    let isHas = false;
    if (allUsername.includes(un)) {
      isHas = true;
      popup("你已拥有账号，请登录！");
    }

    // 清空输入数据
    formData.set_value([]);

    if (isHas) return;

    // 新增账户
    accounts.push({
      username: un,
      password: pw,
      bills: [],
    });
    // 自动登录
    state.setLoginUser(un);
    // 更新页面
    accountPage(un);
  }
};

// 账单分类
const billsType = function () {
  return accounts
    .map((obj) => {
      // 登录账户的账单
      if (state.getLoginUser() === obj.username && obj.bills === []) return [];
      if (state.getLoginUser() !== obj.username) return null;
      return obj.bills.reduce(
        (sum, cur) => {
          sum.all.push(cur);
          sum[cur > 0 ? "income" : "expense"].push(cur);
          return sum;
        },
        { expense: [], income: [], all: [] }
      );
    })
    .filter((obj) => {
      // 不要null
      if (!(obj === null)) return obj;
    });
};

// 计算余额
const calcRemainder = function () {
  const { _, expense, income } = billsType()[0];
  return (
    income.reduce((sum, v) => {
      return (sum += v);
    }, 0) +
    expense.reduce((sum, v) => {
      return (sum += v);
    }, 0)
  );
};

// 新增账目
const addBillsList = function (un, amount) {
  accounts.map((obj) => {
    obj.username === un ? obj.bills.push(+amount) : "";
  });
};
