package com.example.repository;

import com.example.entity.Invite;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface InviteRepository extends CrudRepository<Invite, Long> {
    Optional<Invite> findInviteByInviteCode(String inviteCode);
    
}
