package com.renatoguii.faturaflow.infra.security.token;

import com.renatoguii.faturaflow.entities.user.UserEntity;
import com.renatoguii.faturaflow.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtil {

    @Autowired
    UserRepository userRepository;

    public UserEntity getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            String authenticatedUserEmail = ((UserDetails) authentication.getPrincipal()).getUsername();
            return userRepository.findByEmail(authenticatedUserEmail).get();
        }

        return null;
    }

}
