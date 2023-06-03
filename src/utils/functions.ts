export const delay = (t: number, v: any): Promise<any> => {
  return new Promise(function (resolve) {
    setTimeout(resolve.bind(null, v), t)
  })
}

export const falseLoadingState = async () => {
  await delay(300, null)
  return false
}
