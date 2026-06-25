package com.associados.associados.card.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.associados.associados.card.entity.Card;

@Repository
public interface CardRepository extends JpaRepository<Card, UUID> {
    Optional<Card> findByNumber(String number);

    Optional<Card> findByAssociateId(UUID associateId);

    boolean existsByAssociateId(UUID associateId);

    long countByNumberStartingWith(String numberPrefix);
}
