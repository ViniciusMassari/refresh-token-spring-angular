package com.viniciusmassari.refreshtoken.modules.user;

import com.viniciusmassari.refreshtoken.exceptions.Unathourized;
import com.viniciusmassari.refreshtoken.exceptions.UserNotFound;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class DeleteUserUseCase {
    @Autowired
    private UserRepository userRepository;
    
    public void execute(String userId, String actualLoggedUserId) throws UserNotFound, Unathourized {

        boolean isTheSameUser = actualLoggedUserId.equals(userId);
        if (!isTheSameUser) {
            throw new Unathourized("You cannot delete this user");
        }

        Optional<UserEntity> foundUser = this.userRepository.findById(UUID.fromString(userId));
        foundUser.ifPresentOrElse((user) -> {
            this.userRepository.delete(user);
        }, () -> {
            throw new UserNotFound("User not found");
        });
    }

    ;
}
