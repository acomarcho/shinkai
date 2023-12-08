from flask import Flask, request

from color_matcher import ColorMatcher
from color_matcher.io_handler import load_img_file, save_img_file
from color_matcher.normalizer import Normalizer

import base64
import uuid

app = Flask(__name__)

@app.route("/")
def hello_world():
  return "<p>Hello, World!</p>"

@app.route("/image", methods=['POST'])
def process_image():
  if request.method == 'POST':
    image_file = request.files['image']

    input_file_path = f'./input/{uuid.uuid4()}-{image_file.filename}'
    image_file.save(input_file_path)

    output_image_path = process_image(input_file_path, image_file.filename)

    return {
      "image": create_base64_image(output_image_path)
    }

def process_image(input_file_path, original_file_name):
  cm = ColorMatcher()

  img_src = load_img_file(input_file_path)
  img_ref = load_img_file('./matcher/makoto-scenery.jpg')

  img_res = cm.transfer(src=img_src, ref=img_ref, method='default')
  img_res = Normalizer(img_res).uint8_norm()

  output_image_path = f'./output/{uuid.uuid4()}-{original_file_name}.png'
  save_img_file(img_res, output_image_path)

  return output_image_path

def create_base64_image(input_file_path):
  with open(input_file_path, "rb") as image_file:
    image_data = image_file.read()
    base64_encoded = base64.b64encode(image_data).decode('utf-8')
    return base64_encoded

if __name__ == '__main__':
  app.run(host='0.0.0.0', port=5000)
