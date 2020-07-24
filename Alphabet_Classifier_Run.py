import cv2
import numpy as np
import uuid
import tensorflow as tf
model = tf.keras.models.load_model('./model/alphanetclassifier.h5')
model.summary()
cap = cv2.VideoCapture(0)
imgcount = 0
cap = cv2.VideoCapture(0)
while True:
    _, frame = cap.read()
    img_array = cv2.rectangle(frame, (334, 60), (634, 360), (0, 200, 0), 1)
    cv2.imshow('full', img_array)
    frame = cv2.cvtColor(img_array, cv2.COLOR_BGR2GRAY)
    frame = cv2.GaussianBlur(frame, (35, 35), 0)

    ret, frame = cv2.threshold(frame, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
    frame = frame[60:360, 334:634]
    # contours, hierarchy = cv2.findContours(thresh1, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)[-2:]
    # return img, contours, thresh1
    cv2.imshow('cropped_before_resize', frame)
    crop_img = cv2.resize(frame, (28, 28))
    crop_img = np.array(crop_img, dtype='float32')
    cv2.imshow('cropped', crop_img)
    crop_img = crop_img.reshape([1, 28, 28, 1])
    if cv2.waitKey(1) & 0xFF == ord('s'):
        cv2.imwrite('C:\\Users\\tirupathipodugu\\Documents\\personal\\opencv\\test\\'+str(uuid.uuid4())+'.png', crop_img)
        print('images taken.')
    print(chr(65+np.argmax(model.predict(crop_img))))
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break
cap.release()
cv2.destroyAllWindows()