from PIL import Image, ImageFilter


def preprocess_image(img: Image.Image) -> Image.Image:
    """
    Basic preprocessing: convert to grayscale and sharpen.
    """
    img = img.convert("L")
    img = img.filter(ImageFilter.SHARPEN)
    return img
