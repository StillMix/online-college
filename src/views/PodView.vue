<template>
  <div class="podView">
    <Header />
    <div class="podView__chat">
      <div class="podView__chat__sob">
        <p>Привет!</p>
      </div>
      <div class="podView__chat__my">
        <p>Привет!</p>
      </div>
      <div class="podView__chat__sob">
        <p>Привет!</p>
      </div>
      <div class="podView__chat__my">
        <p>Привет!</p>
      </div>
      <div class="podView__chat__mess">
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
import { defineComponent } from "vue";
import Header from "@/components/Header.vue";

export default defineComponent({
  name: "PodView",
  components: {
    Header,
  },
});
</script>

<style lang="scss">
.podView {
  &__chat {
    border: 1px solid #484848;
    width: 717px;
    height: 891px;
    position: relative;
    padding-bottom: 71px;
    display: flex;
    gap: 12px;
    justify-content: end;
    flex-direction: column;
    &__mess {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 54px;
      position: absolute;
      bottom: 0;
      &__input {
        border-radius: 15px;
        width: 627px;
        height: 100%;
        background: #363636;
        font-family: var(--font-family);
        font-weight: 500;
        font-size: 20px;
        color: #fff;
        &::placeholder {
          font-family: var(--font-family);
          font-weight: 500;
          font-size: 20px;
          color: #6a6a6a;
          padding: 17px;
        }
      }
      &__send {
        border-radius: 15px;
        width: 75px;
        height: 54px;
        background: #097069;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    &__sob {
      border-radius: 24px 24px 24px 0;
      width: 352px;
      min-height: 55px;
      background: #363636;
      padding: 16px 13px;
      p {
        font-family: var(--font-family);
        font-weight: 500;
        line-height: 100%;
        font-size: 20px;
        color: #fff;
        width: 100%;
      }
    }
    &__my {
      border-radius: 24px 24px 24px 0;
      width: 352px;
      min-height: 55px;
      background: #097069;
      margin-left: auto;
      padding: 16px 13px;
      p {
        font-family: var(--font-family);
        font-weight: 500;
        line-height: 100%;
        font-size: 20px;
        color: #fff;
        width: 100%;
      }
    }
  }
}
</style>
