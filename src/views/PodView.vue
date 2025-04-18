<template>
  <div class="podView">
    <Header />
    <div class="podView__container">
      <div class="podView__header">
        <div class="podView__header__avatar">
          <div class="podView__header__avatar__status"></div>
        </div>
        <div class="podView__header__info">
          <p class="podView__header__info__name">Техническая поддержка</p>
          <p class="podView__header__info__status">Онлайн</p>
        </div>
      </div>
      <div class="podView__chat">
        <div class="podView__chat__date">
          <span>Сегодня</span>
        </div>
        <div class="podView__chat__sob message-appear">
          <p>Добро пожаловать в чат поддержки! Чем я могу вам помочь?</p>
          <span class="podView__chat__time">10:15</span>
        </div>
        <div class="podView__chat__my message-appear">
          <p>Здравствуйте! У меня возник вопрос по курсу программирования.</p>
          <span class="podView__chat__time">10:17</span>
        </div>
        <div class="podView__chat__sob message-appear">
          <p>
            Конечно, я готов помочь. Уточните, пожалуйста, что именно вас
            интересует по данному курсу?
          </p>
          <span class="podView__chat__time">10:18</span>
        </div>
        <div class="podView__chat__my message-appear">
          <p>Как долго в среднем занимает прохождение всего курса?</p>
          <span class="podView__chat__time">10:20</span>
        </div>
        <div class="podView__chat__typing">
          <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
      <div class="podView__chat__mess">
        <div class="podView__chat__mess__attach">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14 3C14.7956 3 15.5587 3.31607 16.1213 3.87868C16.6839 4.44129 17 5.20435 17 6V18C17 19.0609 16.5786 20.0783 15.8284 20.8284C15.0783 21.5786 14.0609 22 13 22C11.9391 22 10.9217 21.5786 10.1716 20.8284C9.42143 20.0783 9 19.0609 9 18V6.5C9 6.36739 9.05268 6.24021 9.14645 6.14645C9.24021 6.05268 9.36739 6 9.5 6C9.63261 6 9.75979 6.05268 9.85355 6.14645C9.94732 6.24021 10 6.36739 10 6.5V18C10 18.7956 10.3161 19.5587 10.8787 20.1213C11.4413 20.6839 12.2044 21 13 21C13.7956 21 14.5587 20.6839 15.1213 20.1213C15.6839 19.5587 16 18.7956 16 18V6C16 5.46957 15.7893 4.96086 15.4142 4.58579C15.0391 4.21071 14.5304 4 14 4C13.4696 4 12.9609 4.21071 12.5858 4.58579C12.2107 4.96086 12 5.46957 12 6V17.5C12 17.7652 12.1054 18.0196 12.2929 18.2071C12.4804 18.3946 12.7348 18.5 13 18.5C13.2652 18.5 13.5196 18.3946 13.7071 18.2071C13.8946 18.0196 14 17.7652 14 17.5V6.5C14 6.36739 14.0527 6.24021 14.1464 6.14645C14.2402 6.05268 14.3674 6 14.5 6C14.6326 6 14.7598 6.05268 14.8536 6.14645C14.9473 6.24021 15 6.36739 15 6.5V17.5C15 18.0304 14.7893 18.5391 14.4142 18.9142C14.0391 19.2893 13.5304 19.5 13 19.5C12.4696 19.5 11.9609 19.2893 11.5858 18.9142C11.2107 18.5391 11 18.0304 11 17.5V6C11 4.93913 11.4214 3.92172 12.1716 3.17157C12.9217 2.42143 13.9391 2 15 2"
              fill="#909090"
            />
          </svg>
        </div>
        <input
          class="podView__chat__mess__input"
          placeholder="Напишите сообщение..."
        />
        <button class="podView__chat__mess__send">
          <img alt="send" src="../assets/messsend.svg" />
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import Header from "@/components/Header.vue";

export default defineComponent({
  name: "PodView",
  components: {
    Header,
  },
  setup() {
    onMounted(() => {
      // Анимированное появление сообщений
      const messages = document.querySelectorAll(".message-appear");
      messages.forEach((message, index) => {
        setTimeout(() => {
          message.classList.add("appear");
        }, 500 + index * 700);
      });

      // Показ и скрытие индикатора набора сообщения
      setTimeout(() => {
        const typingIndicator = document.querySelector(
          ".podView__chat__typing"
        );
        if (typingIndicator) {
          typingIndicator.classList.add("show");

          // Через 3 секунды скрываем индикатор и показываем ответ
          setTimeout(() => {
            typingIndicator.classList.remove("show");
            // Здесь можно добавить код для отображения нового сообщения
          }, 3000);
        }
      }, 3500);
    });

    return {};
  },
});
</script>

<style lang="scss">
.podView {
  width: 100%;
  display: flex;
  flex-direction: column;

  &__container {
    width: 71.615vw;
    max-width: 71.615vw;
    margin: 1.042vw auto 0;
    border-radius: 0.521vw;
    overflow: hidden;
    background: #2a2a2a;
    box-shadow: 0 0.26vw 1.042vw rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    height: 40vw;
  }

  &__header {
    display: flex;
    align-items: center;
    padding: 0.781vw 1.042vw;
    background: #363636;
    border-bottom: 0.052vw solid rgba(255, 255, 255, 0.1);

    &__avatar {
      width: 2.083vw;
      height: 2.083vw;
      background: linear-gradient(135deg, #08dccf, #0099ff);
      border-radius: 50%;
      position: relative;
      margin-right: 0.781vw;
      display: flex;
      align-items: center;
      justify-content: center;

      &::after {
        content: "";
        width: 80%;
        height: 80%;
        background: #363636;
        border-radius: 50%;
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      &__status {
        width: 0.521vw;
        height: 0.521vw;
        background: #39b874;
        border-radius: 50%;
        position: absolute;
        bottom: 0;
        right: 0;
        z-index: 2;
        box-shadow: 0 0 0.26vw rgba(57, 184, 116, 0.8);
        animation: pulse 2s infinite;
      }
    }

    &__info {
      display: flex;
      flex-direction: column;

      &__name {
        font-family: var(--font-family);
        font-weight: 500;
        font-size: 0.938vw;
        color: #fff;
      }

      &__status {
        font-family: var(--font-family);
        font-weight: 400;
        font-size: 0.729vw;
        color: #39b874;
      }
    }
  }

  &__chat {
    padding: 1.042vw;
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 0.781vw;
    background: rgba(33, 33, 33, 0.3);
    position: relative;

    &::-webkit-scrollbar {
      width: 0.417vw;
    }

    &::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.1);
      border-radius: 0.521vw;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(8, 220, 207, 0.3);
      border-radius: 0.521vw;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: rgba(8, 220, 207, 0.5);
    }

    &__date {
      text-align: center;
      margin: 0.521vw 0;

      span {
        font-family: var(--font-family);
        font-weight: 400;
        font-size: 0.729vw;
        color: rgba(255, 255, 255, 0.5);
        background: rgba(0, 0, 0, 0.2);
        padding: 0.26vw 0.781vw;
        border-radius: 1.042vw;
      }
    }

    &__sob {
      border-radius: 1.042vw 1.042vw 1.042vw 0;
      max-width: 60%;
      width: auto;
      min-height: 2.604vw;
      background: #363636;
      padding: 0.781vw 1.042vw;
      position: relative;
      margin-bottom: 0.521vw;
      transform-origin: left bottom;
      opacity: 0;
      transform: translateY(0.521vw) scale(0.95);
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      align-self: flex-start;
      box-shadow: 0 0.26vw 0.521vw rgba(0, 0, 0, 0.15);

      &::before {
        content: "";
        position: absolute;
        bottom: 0;
        left: -0.521vw;
        width: 0.521vw;
        height: 0.521vw;
        background: #363636;
        clip-path: polygon(0 0, 100% 100%, 100% 0);
      }

      p {
        font-family: var(--font-family);
        font-weight: 400;
        font-size: 0.833vw;
        line-height: 140%;
        color: #fff;
      }
    }

    &__my {
      border-radius: 1.042vw 1.042vw 0 1.042vw;
      max-width: 60%;
      width: auto;
      min-height: 2.604vw;
      background: linear-gradient(135deg, #097069, #08dccf);
      padding: 0.781vw 1.042vw;
      position: relative;
      margin-bottom: 0.521vw;
      align-self: flex-end;
      transform-origin: right bottom;
      opacity: 0;
      transform: translateY(0.521vw) scale(0.95);
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      box-shadow: 0 0.26vw 0.521vw rgba(0, 0, 0, 0.15);

      &::before {
        content: "";
        position: absolute;
        bottom: 0;
        right: -0.521vw;
        width: 0.521vw;
        height: 0.521vw;
        background: #08dccf;
        clip-path: polygon(0 0, 0 100%, 100% 100%);
      }

      p {
        font-family: var(--font-family);
        font-weight: 400;
        font-size: 0.833vw;
        line-height: 140%;
        color: #fff;
      }
    }

    &__time {
      font-family: var(--font-family);
      font-weight: 400;
      font-size: 0.625vw;
      color: rgba(255, 255, 255, 0.5);
      display: block;
      text-align: right;
      margin-top: 0.26vw;
    }

    &__typing {
      border-radius: 1.042vw 1.042vw 1.042vw 0;
      width: 3.646vw;
      min-height: 2.083vw;
      background: #363636;
      padding: 0.781vw 1.042vw;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      align-self: flex-start;
      opacity: 0;
      transform: translateY(0.521vw);
      transition: all 0.3s ease;
      box-shadow: 0 0.26vw 0.521vw rgba(0, 0, 0, 0.15);

      &::before {
        content: "";
        position: absolute;
        bottom: 0;
        left: -0.521vw;
        width: 0.521vw;
        height: 0.521vw;
        background: #363636;
        clip-path: polygon(0 0, 100% 100%, 100% 0);
      }

      .typing-indicator {
        display: flex;
        align-items: center;
        justify-content: center;

        span {
          height: 0.417vw;
          width: 0.417vw;
          float: left;
          margin: 0 0.104vw;
          background-color: rgba(255, 255, 255, 0.5);
          display: block;
          border-radius: 50%;
          opacity: 0.4;

          &:nth-of-type(1) {
            animation: typing 1s infinite 0s;
          }

          &:nth-of-type(2) {
            animation: typing 1s infinite 0.2s;
          }

          &:nth-of-type(3) {
            animation: typing 1s infinite 0.4s;
          }
        }
      }
    }

    &__mess {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 3.125vw;
      padding: 0.521vw 1.042vw;
      background: #363636;
      border-top: 0.052vw solid rgba(255, 255, 255, 0.1);

      &__attach {
        width: 1.25vw;
        height: 1.25vw;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          transform: rotate(15deg);

          svg path {
            fill: #08dccf;
          }
        }

        svg {
          width: 1.25vw;
          height: 1.25vw;

          path {
            transition: fill 0.3s ease;
          }
        }
      }

      &__input {
        border-radius: 1.563vw;
        width: calc(100% - 4.167vw);
        height: 2.083vw;
        background: #2a2a2a;
        font-family: var(--font-family);
        font-weight: 400;
        font-size: 0.833vw;
        color: #fff;
        padding: 0 1.042vw;
        margin: 0 0.521vw;
        transition: all 0.3s ease;

        &:focus {
          box-shadow: 0 0 0.26vw rgba(8, 220, 207, 0.5);
        }

        &::placeholder {
          font-family: var(--font-family);
          font-weight: 400;
          font-size: 0.833vw;
          color: #6a6a6a;
        }
      }

      &__send {
        width: 2.083vw;
        height: 2.083vw;
        border-radius: 50%;
        background: linear-gradient(135deg, #097069, #08dccf);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        cursor: pointer;

        &:hover {
          transform: scale(1.1);
          box-shadow: 0 0 0.521vw rgba(8, 220, 207, 0.5);
        }

        &:active {
          transform: scale(0.95);
        }

        img {
          width: 1.042vw;
          height: 1.042vw;
        }
      }
    }
  }
}

// Анимации
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(57, 184, 116, 0.8);
  }
  70% {
    box-shadow: 0 0 0 0.521vw rgba(57, 184, 116, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(57, 184, 116, 0);
  }
}

@keyframes typing {
  0% {
    transform: translateY(0px);
    opacity: 0.4;
  }
  50% {
    transform: translateY(-0.208vw);
    opacity: 0.8;
  }
  100% {
    transform: translateY(0px);
    opacity: 0.4;
  }
}

// Класс для появления сообщений
.message-appear.appear {
  opacity: 1;
  transform: translateY(0) scale(1);
}

// Класс для показа индикатора набора
.podView__chat__typing.show {
  opacity: 1;
  transform: translateY(0);
}

// Анимация при наведении для сообщений
.podView__chat__sob:hover,
.podView__chat__my:hover {
  transform: translateY(-0.104vw);
  box-shadow: 0 0.365vw 0.625vw rgba(0, 0, 0, 0.2);
}
</style>
