from flask import Flask, request

from color_matcher import ColorMatcher
from color_matcher.io_handler import load_img_file, save_img_file
from color_matcher.normalizer import Normalizer

app = Flask(__name__)

@app.route("/")
def helllo_world():
  return "<p>Hello, World!</p>"

@app.route("/image", methods=['POST'])
def process_image():
  if request.method == 'POST':
    image_file = request.files['image']

    input_file_path = f'./input/{image_file.filename}'
    image_file.save(input_file_path)
    process_image(input_file_path)

    return {
      "status": "SUCCESS"
    }

def process_image(input_file_path):
  cm = ColorMatcher()

  img_src = load_img_file(input_file_path)
  img_ref = load_img_file('./matcher/makoto-scenery.jpg')

  img_res = cm.transfer(src=img_src, ref=img_ref, method='default')
  img_res = Normalizer(img_res).uint8_norm()

  save_img_file(img_res, './output/res.png')

if __name__ == '__main__':
  app.run(host='0.0.0.0', port=5000)
