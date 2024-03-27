import App from "./App.js";
import createElement from "./tools/createElement.ts";
import render from "./tools/render.ts";

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//     <App />
// );



// function Layout() {
//   return createElement(
//     "div",
//     {
//       title: "hello",
//     },
//     [
//       createElement("h3", { style: "color:red;" }, ["HELLO WORLD"]),
//       createElement("div", {}, [
//         createElement("span", { style: "color:green" }, [
//           "React 让你可以通过组件来构建用户界面。你可以创建像Thumbnail、LikeButton和Video这样的组件。然后将它们组合成整个应用程序。",
//         ]),
//       ]),
//       createElement("a", { href: "https://www.baidu.com" }, ["百度一下"]),
//       createElement("div", {}, [
//         createElement("p", {}, [
//           "一口气英语磁带转录版商务英语基础会话视频教程(初级)从零起步学英语 口语篇精通美语语音(五)FUN肆说 乐享流行 嗨学英语新东方词汇进阶-Vocabulary 23000",
//         ]),
//         createElement("p", {}, [
//           "文，wen，从玄从爻。天地万物的信息产生出来的现象、纹路、轨迹，描绘出了阴阳二气在事物中的运行轨迹和原理。故文即为符。上古之时，符文一体。古者伏羲氏之王天下也，始画八卦，造书契，以代结绳（爻）之政，由是文籍生焉。——《尚书序》依类象形，故谓之文。其后形声相益，即谓之字。——《说文》序》仓颉造书，形立谓之文，声具谓之字。——《古今通论》(1) 象形。甲骨文此字象纹理纵横交错形。“文”是汉字的一个部首。本义：花纹；纹理。(2) 同本义 [figure;veins]文，英语念为：text、article等，从字面意思上就可以理解为文章、文字，与古今中外的各个文学著作中出现的各种文字字形密不可分。古有甲骨文、金文、小篆等，今有宋体、楷体等，都在这一方面突出了“文”的重要性。古今中外，人们对于“文”都有自己不同的认知，从大的方面来讲，它可以用于表示一个民族的文化历史，从小的方面来说它可用于用于表示单独的一个“文”字，可用于表示一段话，也可用于人物的姓氏。 查看百科",
//         ]),
//       ]),
//       createElement("ul", {}, [
//         createElement("li", { key: "1" }, [
//           "1I prefer walking to climbing.我喜欢散步多于喜欢爬山。《牛津词典》",
//         ]),
//         createElement("li", { key: "2" }, [
//           "2I prefer walking to climbing.我喜欢散步多于喜欢爬山。《牛津词典》",
//         ]),
//         createElement("li", { key: "3" }, [
//           "3I prefer walking to climbing.我喜欢散步多于喜欢爬山。《牛津词典》",
//         ]),
//         createElement("li", { key: "4" }, [
//           "4I prefer walking to climbing.我喜欢散步多于喜欢爬山。《牛津词典》",
//         ]),
//         createElement("li", { key: "5" }, [
//           "5I prefer walking to climbing.我喜欢散步多于喜欢爬山。《牛津词典》",
//         ]),
//         createElement("li", { key: "6" }, [
//           "6I prefer walking to climbing.我喜欢散步多于喜欢爬山。《牛津词典》",
//         ]),
//         createElement("li", { key: "7" }, [
//           "7I prefer walking to climbing.我喜欢散步多于喜欢爬山。《牛津词典》",
//         ]),
//         createElement("li", { key: "8" }, [
//           "8I prefer walking to climbing.我喜欢散步多于喜欢爬山。《牛津词典》",
//         ]),
//         createElement("li", { key: "9" }, [
//           "9I prefer walking to climbing.我喜欢散步多于喜欢爬山。《牛津词典》",
//         ]),
//         createElement("li", { key: "10" }, [
//           "10I prefer walking to climbing.我喜欢散步多于喜欢爬山。《牛津词典》",
//         ]),
//       ]),
//       createElement("div", {}, [
//         createElement("span", { style: "color:green" }, [
//           "React 让你可以通过组件来构建用户界面。你可以创建像Thumbnail、LikeButton和Video这样的组件。然后将它们组合成整个应用程序。",
//         ]),
//       ]),
//       createElement("div", {}, [
//         createElement("span", { style: "color:green" }, [
//           "React 让你可以通过组件来构建用户界面。你可以创建像Thumbnail、LikeButton和Video这样的组件。然后将它们组合成整个应用程序。",
//         ]),
//       ]),
//       createElement(Counter,{},[]),
//     ]
//   );
// }

// console.log(element);

// render(Counter, document.querySelector("#root"));
render(createElement(App), document.querySelector("#root"));
// setTimeout(() => {
//   render(
//     createElement(
//       "div",
//       {
//         title: "hello",
//       },
//       [
//         createElement("h3", { style: "color:red;" }, ["HELLO WORLD"]),
//         createElement("div", {}, [
//           createElement("span", { style: "color:green" }, [
//             "React 让你可以通过组件来构建用户界面。你可以创建像Thumbnail、LikeButton和Video这样的组件。然后将它们组合成整个应用程序。",
//           ]),
//         ]),
//         createElement(
//           "a",
//           { href: "https://www.google.com", style: "background-color:pink;" },
//           ["谷歌一下"]
//         ),
//         createElement("div", {}, [
//           createElement("p", {}, [
//             "一口气英语磁带转录版商务英语基础会话视频教程(初级)从零起步学英语 口语篇精通美语语音(五)FUN肆说 乐享流行 嗨学英语新东方词汇进阶-Vocabulary 23000",
//           ]),
//           createElement("p", {}, [
//             "文，wen，从玄从爻。天地万物的信息产生出来的现象、纹路、轨迹，描绘出了阴阳二气在事物中的运行轨迹和原理。故文即为符。上古之时，符文一体。古者伏羲氏之王天下也，始画八卦，造书契，以代结绳（爻）之政，由是文籍生焉。——《尚书序》依类象形，故谓之文。其后形声相益，即谓之字。——《说文》序》仓颉造书，形立谓之文，声具谓之字。——《古今通论》(1) 象形。甲骨文此字象纹理纵横交错形。“文”是汉字的一个部首。本义：花纹；纹理。(2) 同本义 [figure;veins]文，英语念为：text、article等，从字面意思上就可以理解为文章、文字，与古今中外的各个文学著作中出现的各种文字字形密不可分。古有甲骨文、金文、小篆等，今有宋体、楷体等，都在这一方面突出了“文”的重要性。古今中外，人们对于“文”都有自己不同的认知，从大的方面来讲，它可以用于表示一个民族的文化历史，从小的方面来说它可用于用于表示单独的一个“文”字，可用于表示一段话，也可用于人物的姓氏。 查看百科",
//           ]),
//         ]),
//         createElement("ul", {}, [
//           createElement("li", { key: "5" }, [
//             "5I prefer walking to climbing.我喜欢散步多于喜欢爬山。《牛津词典》",
//           ]),
//           createElement("li", { key: "9" }, [
//             "9I prefer walking to climbing.我喜欢散步多于喜欢爬山。《牛津词典》",
//           ]),
//           createElement("li", { key: "10" }, [
//             "10I prefer walking to climbing.我喜欢散步多于喜欢爬山。《牛津词典》",
//           ]),
//           createElement("li", { key: "6" }, [
//             "6I prefer walking to climbing.我喜欢散步多于喜欢爬山。《牛津词典》",
//           ]),
//           createElement("li", { key: "7" }, [
//             "7I prefer walking to climbing.我喜欢散步多于喜欢爬山。《牛津词典》",
//           ]),
//           createElement("li", { key: "8" }, [
//             "8I prefer walking to climbing.我喜欢散步多于喜欢爬山。《牛津词典》",
//           ]),
//           createElement("li", { key: "1" }, [
//             "1I prefer walking to climbing.我喜欢散步多于喜欢爬山。《牛津词典》",
//           ]),
//           createElement("li", { key: "3" }, [
//             "3I prefer walking to climbing.我喜欢散步多于喜欢爬山。《牛津词典》",
//           ]),
//           createElement("li", { key: "4" }, [
//             "4I prefer walking to climbing.我喜欢散步多于喜欢爬山。《牛津词典》",
//           ]),
//           createElement("li", { key: "2" }, [
//             "2I prefer walking to climbing.我喜欢散步多于喜欢爬山。《牛津词典》",
//           ]),
//         ]),
//       ]
//     ),
//     document.querySelector("#root")
//   );
// }, 2000);
