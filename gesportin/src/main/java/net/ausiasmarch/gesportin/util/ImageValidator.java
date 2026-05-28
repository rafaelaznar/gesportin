package net.ausiasmarch.gesportin.util;

import java.awt.Image;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Objects;

import javax.imageio.ImageIO;

public class ImageValidator {

    private static final int MAX_IMAGE_SIZE = 1500000;
    private static final int MAX_WIDTH = 300;
    private static final int MAX_HEIGHT = 300;

    public static boolean isValidPicture(byte[] imageDecodedOnBytes) throws IOException {

        Image picture = ImageIO.read(new ByteArrayInputStream(imageDecodedOnBytes));

        Objects.requireNonNull(picture, "Image is not valid");

        int picHeight = picture.getHeight(null);
        int picWidth = picture.getWidth(null);

        return imageDecodedOnBytes.length <= MAX_IMAGE_SIZE && picHeight <= MAX_HEIGHT && picWidth <= MAX_WIDTH;
    }
}
