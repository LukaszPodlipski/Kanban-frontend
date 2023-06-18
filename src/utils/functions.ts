export const delay = (t: number, v: any): Promise<any> => {
  return new Promise(function (resolve) {
    setTimeout(resolve.bind(null, v), t)
  })
}

export const falseLoadingState = async (time: number = 300) => {
  await delay(time, null)
  return false
}
