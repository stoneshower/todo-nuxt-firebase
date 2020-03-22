import { db } from '@/plugins/firebase'

export const updateData = (newObj, list, item) => {
  db.collection('todo').get().then((querySnapShot) => {
    return querySnapShot.docs.forEach((doc) => {
      const currentItem = list.filter((elem) => {
        return elem.id === item.id
      })[0]
      if (doc.id === currentItem.id) {
        doc.ref.update(newObj)
      }
    })
  })
}

export const deleteData = (list, item) => {
  db.collection('todo').get().then((querySnapShot) => {
    return querySnapShot.docs.forEach((doc) => {
      const currentItem = list.filter((elem) => {
        return elem.id === item.id
      })[0]
      if (doc.id === currentItem.id) {
        doc.ref.delete()
          .then(() => console.log('document is successfully deleted'))
          .catch(() => console.log('something is wrong'))
      }
    })
  })

  // let currentItem
  // toDoRef.get().then((querySnapShot) => {
  //   return querySnapShot.docs.forEach((doc) => {
  //     currentItem = componentData.filter((elem) => {
  //       return elem.id === item.id
  //     })[0]

  //     if (doc.id === currentItem.id) {
  //       doc.ref.delete()
  //         .then(() => console.log('document is successfully deleted'))
  //         .catch(() => console.log('something is wrong'))
  //     }
  //   })
  // })
}
