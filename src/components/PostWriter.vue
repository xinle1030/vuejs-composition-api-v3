<script lang="ts" setup>
import { ref, onMounted, watch, watchEffect } from "vue";
import { Post, TimelinePost } from "../posts";
import { useRouter } from "vue-router"
import { marked } from "marked";
import highlightjs from "highlight.js";
import debounce from "lodash/debounce";
import { usePosts } from "../stores/posts";
import { useUsers } from "../stores/users";

// pass post as props to PostWriter from NewPost
const props = defineProps<{
  post: TimelinePost | Post;
}>();

const emit = defineEmits<{
  (event: "submit", post: Post): void;
}>();

const title = ref(props.post.title);
const content = ref(props.post.markdown);
const html = ref("");
const contentEditable = ref<HTMLDivElement>(); // pass in <type> to ref

const posts = usePosts();
const router = useRouter();
const usersStore = useUsers();

function parseHtml(markdown: string) {
  // parse string to html 
  marked.parse(
    markdown,
    // allow for syntax highlighting
    {
      gfm: true, // github flavoured markdown
      breaks: true, 
      // highlight callback
      highlight: (code) => {
        return highlightjs.highlightAuto(code).value;
      }
    },
    (err, parseResult) => {
      html.value = parseResult;
    }
  );
}

// same function as watch(), just watchEffect() have immediate: true by default
// watchEffect(() => {
//   marked.parse(
//     content.value,
//     (err, parseResult) => {
//       html.value = parseResult;}
//   );})

// use watch so everytime the content changes, we will update the output html
// watch content here as content is the first arg
watch(
  content,
  // use debounce() to wait for user to stop typing for 250 ms, only then update newContent with parsing into html and highlighting for performance optimization
  debounce((newContent) => {
    // update HTML 
    parseHtml(newContent);
  }, 250),
  {
    immediate: true
  }
);

onMounted(() => {
  // check if const contentEditable = ref<HTMLDivElement>(); has been associated with       
  // <div
        // ref="contentEditable"
        // contenteditable
        // @input="handleInput" />
  if (!contentEditable.value) {
    throw Error("ContentEditable DOM node was not found");
  }
  // assign default value from TimelinePost
  contentEditable.value.innerText = content.value;
});

function handleInput() {
  if (!contentEditable.value) {
    throw Error("ContentEditable DOM node was not found");
  }
  content.value = contentEditable.value.innerText;
}

async function handleClick() {
  if (!usersStore.currentUserId) {
    throw Error('User was not found')
  }

  const newPost: Post = {
    ...props.post,
    created: typeof props.post.created === 'string' ? props.post.created : props.post.created.toISO(),
    title: title.value,
    authorId: usersStore.currentUserId,
    markdown: content.value,
    html: html.value
  };
  emit('submit', newPost);
}
</script>

<template>
  <div class="columns">
    <div class="column">
      <div class="field">
        <div class="label">Post title</div>
        <input
          v-model="title"
          type="text"
          class="input" />
      </div>
    </div>
  </div>

  <div class="columns">
    <!-- input from the left -->
    <div class="column">
      <!-- use ref="contentEditable" to associate the contentEditable const in the script above to this DOM node -->
      <!-- @input: listen to an input event on this div and when it changes, we will update the value of content -->
      <div
        ref="contentEditable"
        contenteditable
        @input="handleInput" />
    </div>
    <!-- output in the right -->
    <div class="column">
      <!-- use v-html to pass in html content to the div -->
      <div v-html="html" />
    </div>
  </div>

  <div class="columns">
    <div class="column">
      <button
        class="button is-primary is-pulled-right"
        @click="handleClick">
        Save Post
      </button>
    </div>
  </div>
</template>
