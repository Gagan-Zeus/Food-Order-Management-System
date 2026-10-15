package in.masalabox.foodiesapi.service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

import in.masalabox.foodiesapi.io.FoodRequest;
import in.masalabox.foodiesapi.io.FoodResponse;

public interface FoodService {

    String uploadFile(MultipartFile file);

    FoodResponse addFood(FoodRequest request, MultipartFile file);

    List<FoodResponse> readFoods();

    FoodResponse readFood(String id);

    boolean deleteFile(String filename);

    void deleteFood(String id);

}
