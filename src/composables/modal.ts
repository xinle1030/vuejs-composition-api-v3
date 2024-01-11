import { ref, shallowRef } from "vue";
import SignupForm from "../components/SignupForm.vue"
import SigninForm from "../components/SigninForm.vue"

const show = ref(false);
const component = shallowRef(); // useShallowRef for optimization due to nested components to have shallow watch

export function useModal() {
  return {
    show, // whether the modal is shown or not
    component,
    showModal: (type: 'signUp' | 'signIn') => {
      show.value = true // update show.value to true when showing modal
      switch (type) {
        case 'signIn': return component.value = SigninForm
        case 'signUp': return component.value = SignupForm
      }
    },
    hideModal: () => (show.value = false),
  };
}
