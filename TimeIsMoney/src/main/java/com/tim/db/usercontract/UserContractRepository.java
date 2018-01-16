package com.tim.db.usercontract;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tim.entities.UserContract;
import com.tim.entities.UserContractKey;

public interface UserContractRepository extends JpaRepository<UserContract, UserContractKey>,UserContractRepositoryCustom {

}
