// This file can be placed anywhere, e.g., app/utils/refreshFlag.js
export let  shouldRefreshPageA = false;

export function setShouldRefreshPageA(value) {
  shouldRefreshPageA = value;
  console.log('from refresh', shouldRefreshPageA);
}
