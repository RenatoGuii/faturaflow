package com.renatoguii.faturaflow.services;

import com.renatoguii.faturaflow.dtos.user.AutheticationDTO;
import com.renatoguii.faturaflow.dtos.user.UserRegisterDTO;
import com.renatoguii.faturaflow.entities.user.UserEntity;
import com.renatoguii.faturaflow.exceptions.CustomAuthenticationException;
import com.renatoguii.faturaflow.exceptions.UserException;
import com.renatoguii.faturaflow.infra.security.token.JwtService;
import org.apache.tomcat.websocket.AuthenticationException;
import com.renatoguii.faturaflow.infra.security.token.AccessToken;
import com.renatoguii.faturaflow.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    JwtService jwtService;

    public List<UserEntity> getAllUsers () {
        try {
            List<UserEntity> users = userRepository.findAll();
            return users;
        } catch (Exception e) {
            throw new UserException("There was an error loading users");
        }
    }

    public UserEntity getUserByEmail(String email) {
        return userRepository.findByEmail(email).get();
    }

    public UserEntity getUserById(String id) {
        try {
            Optional<UserEntity> possibleUser = userRepository.findById(id);

            if (possibleUser.isEmpty()) {
                throw new UserException("");
            }

            UserEntity user = possibleUser.get();

            return user;

        } catch (Exception e) {
            throw new UserException("No user record was found!");
        }
    }

    public Boolean saveUser(UserRegisterDTO data) {
        try {
            Optional<UserEntity> possibleUser = userRepository.findByEmail(data.email());

            if (possibleUser.isPresent()) {
                throw new UserException("");
            }

            String formattedCreatedDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss"));

            UserEntity newUser = new UserEntity(data.name(), data.lastName(), data.email(), data.password(), formattedCreatedDate);

            encodePassword(newUser);
            userRepository.save(newUser);

            return true;
        } catch (Exception e) {
            throw new UserException("There was an error in the user registration");
        }
    }

    public AccessToken authenticate(AutheticationDTO data) throws AuthenticationException {
        Optional<UserEntity> possibleUser = userRepository.findByEmail(data.email());
        if (possibleUser.isEmpty()) {
            throw new CustomAuthenticationException("There is no user with these credentials");
        }

        // Verifica se a senha digitada bate com a senha do usuário
        boolean matches = passwordEncoder.matches(data.password(), possibleUser.get().getPassword());

        if (matches) {
            return jwtService.generateToken(possibleUser.get());
        }

        return null;
    }

    private void encodePassword (UserEntity user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
    }

}
