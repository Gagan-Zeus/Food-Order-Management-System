package in.masalabox.foodiesapi.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import in.masalabox.foodiesapi.entity.CartEntity;

@Repository
public interface CartRepository extends MongoRepository<CartEntity, String> {

    List<CartEntity> findByUserId(String userId );

    void deleteByUserId(String userId);

}
