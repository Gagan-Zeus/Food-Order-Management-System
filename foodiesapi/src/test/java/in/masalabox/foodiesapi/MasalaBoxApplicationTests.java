package in.masalabox.foodiesapi;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.beans.factory.annotation.Autowired;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class MasalaBoxApplicationTests {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private in.masalabox.foodiesapi.repository.UserRepository userRepository;

	@Test
	void contextLoads() {
	}

	@Test
	void malformedPublicRegistrationRequestIsNotMaskedAsForbidden() throws Exception {
		mockMvc.perform(post("/api/register")
				.contentType(MediaType.APPLICATION_JSON)
				.content("{"))
			.andExpect(status().isBadRequest());
	}

	@Test
	void duplicateRegistrationReturnsConflict() throws Exception {
		mockMvc.perform(post("/api/register")
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"name\":\"Gagan\",\"email\":\"gagan@gmail.com\",\"password\":\"password\"}"))
			.andExpect(status().isConflict());
	}

	@Test
	void successfulLoginReturnsToken() throws Exception {
		mockMvc.perform(post("/api/login")
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"email\":\"gagan@gmail.com\",\"password\":\"password\"}"))
			.andExpect(status().isOk());
	}

	@Test
	void invalidPasswordReturnsUnauthorized() throws Exception {
		mockMvc.perform(post("/api/login")
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"email\":\"gagan@gmail.com\",\"password\":\"wrongpassword\"}"))
			.andExpect(status().isUnauthorized());
	}

	@Test
	void nonexistentUserReturnsUnauthorized() throws Exception {
		mockMvc.perform(post("/api/login")
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"email\":\"nonexistent_random_user@gmail.com\",\"password\":\"wrongpassword\"}"))
			.andExpect(status().isUnauthorized());
	}

}
