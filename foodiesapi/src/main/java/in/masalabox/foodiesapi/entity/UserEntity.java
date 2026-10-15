package in.masalabox.foodiesapi.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "users" )
@Builder
public class UserEntity {

    @Id
    private String id;
    private String name;
    @Indexed(unique = true)
    private String email;
    private String password;
}
